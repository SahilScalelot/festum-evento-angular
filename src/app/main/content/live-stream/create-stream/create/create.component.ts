import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateStreamService } from '../create-stream.service';
import { CONSTANTS } from 'src/app/main/common/constants';
import { NgSelectConfig } from "@ng-select/ng-select";
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import * as moment from "moment";
import { CreateEventService } from '../../../create-event/create-event.service';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  constants: any = CONSTANTS;
  createStreamForm: any;
  liveStreamId: any = '';
  minDateValue: any = new Date();
  isLoading: boolean = false;

  eventCategories: any = [];

  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _createStreamService: CreateStreamService,
    private _globalFunctions: GlobalFunctions,
    private _config: NgSelectConfig,
    private _createEventService: CreateEventService,
  ) { }

  ngOnInit(): void {
    this._prepareLiveStreamForm();
    this.getCategories();
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.getLiveStreamById(this.liveStreamId);
    }
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  
  getCategories(): void {
    this.isLoading = true;
    this._createEventService.getEventCategories().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.eventCategories = result.Data || [];
        this.isLoading = false;
      }
    }, (error: any) => {
      // this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getLiveStreamById(liveStreamId: any = ''): void {
    this.isLoading = true;
    this._createStreamService.getLiveStreamById(liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const liveStreamObj: any = result?.Data || {};
        this._prepareLiveStreamForm(liveStreamObj || {});
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onEventTypeChange(eventType: any): void {
    if (eventType == 'paid') {
      this.createStreamForm.get('price_per_user').enable();
      this.createStreamForm.get('price_per_user').setValue(99);
      this.createStreamForm.get('price_per_user').setValidators([Validators.required]);
      this.createStreamForm.get('price_per_user').updateValueAndValidity();
    } else if (eventType == 'free') {
      this.createStreamForm.get('price_per_user').setValue(0);
      this.createStreamForm.get('price_per_user').disable();
      this.createStreamForm.get('price_per_user').clearValidators();
      this.createStreamForm.get('price_per_user').updateValueAndValidity();
    }
  }

  prepareLiveStreamObj(liveStreamObj: any = {}): any {
    const preparedOnlineShopOfferObj: any = this._globalFunctions.copyObject(liveStreamObj);
    preparedOnlineShopOfferObj.event_date = moment(liveStreamObj.event_date).format('YYYY-MM-DD');
    preparedOnlineShopOfferObj.event_start_time = this.prepareTime(liveStreamObj.event_start_time);
    preparedOnlineShopOfferObj.event_end_time = this.prepareTime(liveStreamObj.event_end_time);
    return preparedOnlineShopOfferObj;
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return dateWithTime.getHours() + ':' + dateWithTime.getMinutes();
    }
    return dateWithTime;
  }

  validateLiveStreamObj(liveStreamObj: any): any {
    // if (liveStreamObj.event_start_time || liveStreamObj.event_end_time) {
    //   this._sNotify.error('Notification Date is required!', 'Oops!');
    //   return false;
    // }
    return true;
  }

  createLiveStream(): void {
    if (this.createStreamForm.invalid) {
      Object.keys(this.createStreamForm.controls).forEach((key) => {
        this.createStreamForm.controls[key].touched = true;
        this.createStreamForm.controls[key].markAsDirty();
      });
      return;
    }
    if (!this.validateLiveStreamObj(this.createStreamForm.value)) {
      return;
    }
    this.isLoading = true;
    this.createStreamForm.disable();
    const preparedStreamObj: any = this.prepareLiveStreamObj(this.createStreamForm.value);
    this._createStreamService.createLiveStream(preparedStreamObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        localStorage.setItem('lsId', result.Data._id);
        this.isLoading = false;
        this.createStreamForm.enable();
        this._router.navigate(['/live-stream/create/photos-and-videos']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.createStreamForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.createStreamForm.enable();
    });
  }

  private _prepareLiveStreamForm(liveStreamObj: any = {}): void {
    this.createStreamForm = this._formBuilder.group({
      livestreamid: [this.liveStreamId || ''],
      event_name: [liveStreamObj?.event_name || '', [Validators.required]],
      event_category: [liveStreamObj?.event_category?._id || '', [Validators.required]],
      event_description: [liveStreamObj?.event_description || '', [Validators.required]],
      event_date: [liveStreamObj && liveStreamObj.event_date ? new Date(liveStreamObj?.event_date) : '', [Validators.required]],
      event_start_time: [liveStreamObj?.event_start_time || '', [Validators.required]],
      event_end_time: [liveStreamObj?.event_end_time || '', [Validators.required]],
      event_type: [liveStreamObj?.event_type || 'free', [Validators.required]],
      price_per_user: [liveStreamObj?.price_per_user || '', [Validators.required]],
    });
    this.onEventTypeChange(liveStreamObj?.event_type || 'free');
  }

}
