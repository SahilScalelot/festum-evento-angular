import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import * as _ from 'lodash';
import * as moment from "moment";
import { NgSelectConfig } from "@ng-select/ng-select";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateStreamService } from '../create-stream.service';
import { CONSTANTS } from 'src/app/main/common/constants';
declare var $: any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  constants: any = CONSTANTS;
  createStreamForm: any;
  createStreamObj: any;
  liveStreamId: any = '';
  minDateValue: any = new Date();

  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _createStreamService: CreateStreamService,
    private _globalFunctions: GlobalFunctions,
    private _config: NgSelectConfig
  ) { }

  ngOnInit(): void {
    this._prepareCreateStreamForm();
  }

  onEventTypeChange(eventType: any): void {
    if (eventType == 'paid') {
      this.createStreamForm.get('price_per_user').enable();
      this.createStreamForm.get('price_per_user').setValue(99);
    } else if (eventType == 'free') {
      this.createStreamForm.get('price_per_user').setValue(0);
      this.createStreamForm.get('price_per_user').disable();
    }
  }

  createLiveStream(): void {
    if (this.createStreamForm.invalid) {
      Object.keys(this.createStreamForm.controls).forEach((key) => {
        this.createStreamForm.controls[key].touched = true;
        this.createStreamForm.controls[key].markAsDirty();
      });
      return;
    }
    console.log(this.createStreamForm.value);
    
    // this._router.navigate(['/live-stream/create/photos-and-videos']);

    // this.isLoading = true;
    // this.createStreamForm.disable();
    // this.createStreamObj = this._prepareCreateStreamForm(this.createStreamForm.value);
    // this._createStreamService.createLiveStream(this.createStreamObj).subscribe((result: any) => {
    //   if (result && result.IsSuccess) {
    //     this.isLoading = false;
    //     this.createStreamForm.enable();
    //     this._router.navigate(['/live-stream/create/photos-and-videos']);
    //   } else {
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //     this.isLoading = false;
    //     this.createStreamForm.enable();
    //   }
    // }, (error: any) => {
    //   this._globalFunctions.errorHanding(error, this, true);
    //   this.isLoading = false;
    //   this.createStreamForm.enable();
    // });
  }

  private _prepareCreateStreamForm(createStreamObj: any = {}): void {
    this.createStreamForm = this._formBuilder.group({
      livestreamid: [this.liveStreamId || ''],
      event_name: [createStreamObj?.event_name || '', [Validators.required]],
      event_category: [createStreamObj?.event_category || '', [Validators.required]],
      event_description: [createStreamObj?.event_description || '', [Validators.required]],
      event_date: [createStreamObj?.event_date || '', [Validators.required]],
      event_start_time: [createStreamObj?.event_start_time || '', [Validators.required]],
      event_end_time: [createStreamObj?.event_end_time || '', [Validators.required]],
      event_type: [createStreamObj?.event_type || 'free', [Validators.required]],
      price_per_user: [createStreamObj?.price_per_user || '', [Validators.required]],
    });
    this.onEventTypeChange(createStreamObj?.event_type || 'free');
  }

}
