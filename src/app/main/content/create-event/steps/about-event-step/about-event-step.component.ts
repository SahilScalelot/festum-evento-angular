import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import * as moment from 'moment';
import { CreateEventService } from '../../create-event.service';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-about-event-step',
  templateUrl: './about-event-step.component.html',
  styleUrls: ['./about-event-step.component.scss']
})
export class AboutEventStepComponent implements OnInit {
  minDateValue: any = new Date(new Date().setDate(new Date().getDate() + 2));
  aboutEventForm: any;
  isLoading: boolean = false;
  aboutObj: any;
  eventId: any;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _createEventService: CreateEventService,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
  ) {
  }

  ngOnInit(): void {
    this.getEventId();
    this.getAboutEvent();
    this._prepareAboutEventForm(this.aboutObj);
  }

  onTextEditorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getEventId(): void {
    if (localStorage.getItem('eId')) {
      this.eventId = localStorage.getItem('eId');
    } else {
      this._router.navigate(['/events']);
    }
  }

  private _prepareAboutEventForm(eventObj: any = {}): void {
    this.aboutEventForm = this._formBuilder.group({
      date: [eventObj && eventObj.start_date ? [new Date(eventObj?.start_date), new Date(eventObj?.end_date)] : '', [Validators.required, this.startAndEndDateValidator]],
      start_time: [eventObj?.start_time, [Validators.required]],
      end_time: [eventObj?.end_time, [Validators.required]],
      about_event: [eventObj?.about_event],
    });
  }

  getAboutEvent(): any {
    this.isLoading = true;
    this._createEventService.getAbout(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.aboutObj = result.Data.about;
        this._prepareAboutEventForm(this.aboutObj);
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

  validateAboutEventForm(): boolean {
    if (this.aboutEventForm.invalid) {
      Object.keys(this.aboutEventForm.controls).forEach((key) => {
        this.aboutEventForm.controls[key].touched = true;
        this.aboutEventForm.controls[key].markAsDirty();
      });
      return false;
    }

    const preparedStartTime: any = this.prepareTime(this.aboutEventForm.value.start_time);
    const preparedEndTime: any = this.prepareTime(this.aboutEventForm.value.end_time);
    const startTime = moment(preparedStartTime, 'hh:mm');
    const endTime = moment(preparedEndTime, 'hh:mm');
    if (!startTime.isBefore(endTime) || startTime.isSame(endTime)) {
      this.isLoading = false;
      this.aboutEventForm.enable();
      this._sNotify.error('Start time is must before End time Or Both time should not same', 'Oops');
      return false;
    }

    return true;
  }

  next(): void {
    if (!this.validateAboutEventForm()) {
      return;
    }
    this.isLoading = true;
    this.aboutEventForm.disable();
    const preparedEventObj: any = this.prepareAboutEventObj(this.aboutEventForm.value);    
    this._createEventService.about(preparedEventObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.aboutEventForm.enable();
        this._router.navigate(['/events/create/arrangement']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.aboutEventForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.aboutEventForm.enable();
    });
  }

  startAndEndDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && control.value !== '' && control.value.length &&
     (control.value[1] === undefined || control.value[1] === null || control.value[1] === 'Invalid Date')) {
      return { 'end_date_require': true };
    }
    return null;
  }

  prepareAboutEventObj(aboutEventObj: any): any {
    const preparedAboutEventObj: any = {};
    preparedAboutEventObj.eventid = this.eventId;
    preparedAboutEventObj.start_date = moment(aboutEventObj.date[0]).format('YYYY-MM-DD');
    preparedAboutEventObj.end_date = moment(aboutEventObj.date[1]).format('YYYY-MM-DD');
    preparedAboutEventObj.start_time = this.prepareTime(aboutEventObj.start_time);
    preparedAboutEventObj.end_time = this.prepareTime(aboutEventObj.end_time);
    preparedAboutEventObj.about_event = aboutEventObj.about_event;
    return preparedAboutEventObj;
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return moment(dateWithTime).format('HH') + ':' + moment(dateWithTime).format('mm');
    }
    return dateWithTime;
  }
}
