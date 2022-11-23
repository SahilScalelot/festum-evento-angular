import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import * as moment from 'moment';
import { CreateEventService } from '../../create-event.service';
import { GlobalFunctions } from 'src/app/main/common/global-functions';

@Component({
  selector: 'app-about-event-step',
  templateUrl: './about-event-step.component.html',
  styleUrls: ['./about-event-step.component.scss']
})
export class AboutEventStepComponent implements OnInit {
  minDateValue: any = new Date();
  aboutEventForm: any;

  isLoading: boolean = false;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

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
    if (localStorage.getItem('newEventObj')) {
      let eventString: any = localStorage.getItem('newEventObj');
      const newEventObj = JSON.parse(eventString);
      if (newEventObj && newEventObj.add_event) {
        this.newEventObj = newEventObj.add_event._id;
      }
    }
    this._prepareAboutEventForm(this.eventObj);
    this.prepareEventObj();
  }

  prepareEventObj(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    } else {
      this._router.navigate(['/events']);
    }
    if (!this.eventObj || !this.eventObj.add_event) {
      this._router.navigate(['/events']);
    }
  }

  private _prepareAboutEventForm(eventObj: any = {}): void {
    this.aboutEventForm = this._formBuilder.group({
      date: [eventObj && eventObj.about_event && eventObj.about_event.event_start_date ? [new Date(eventObj?.about_event?.event_start_date), new Date(eventObj?.about_event?.event_end_date)] : '', [Validators.required]],
      start_time: [eventObj?.about_event?.event_start_time, [Validators.required]],
      end_time: [eventObj?.about_event?.event_end_time, [Validators.required]],
      about_event: [eventObj?.about_event?.about_event],
    });
  }

  next(): void {
    if (this.aboutEventForm.invalid) {
      Object.keys(this.aboutEventForm.controls).forEach((key) => {
        this.aboutEventForm.controls[key].touched = true;
        this.aboutEventForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.aboutEventForm.disable();
    this.eventObj = this.prepareAboutEventObj(this.aboutEventForm.value);
    this._createEventService.about(this.eventObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.aboutEventForm.enable();
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
    this._router.navigate(['/events/create/arrangement']);
  }

  prepareAboutEventObj(aboutEventObj: any): any {
    const preparedAboutEventObj: any = {};
    preparedAboutEventObj.eventid = this.newEventObj;
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
      return dateWithTime.getHours() + ':' + dateWithTime.getMinutes();
    }
    return dateWithTime;
  }
}
