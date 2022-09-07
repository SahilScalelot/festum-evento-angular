import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-about-event-step',
  templateUrl: './about-event-step.component.html',
  styleUrls: ['./about-event-step.component.scss']
})
export class AboutEventStepComponent implements OnInit {
  minDateValue: any = new Date();
  aboutEventForm: any;
  eventObj: any = {about_event: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    }
    this.aboutEventForm = this._formBuilder.group({
      date: [this.eventObj && this.eventObj.about_event && this.eventObj.about_event.event_start_date ?
        [new Date(this.eventObj?.about_event?.event_start_date), new Date(this.eventObj?.about_event?.event_end_date)] : '', [Validators.required]],
      start_time: [this.eventObj?.about_event?.event_start_time, [Validators.required]],
      end_time: [this.eventObj?.about_event?.event_end_time, [Validators.required]],
      about_event: [this.eventObj?.about_event?.about_event],
    });
  }

  validate(): any {
    if (!this.aboutEventForm.value.date || !this.aboutEventForm.value.date.length) {
      this._sNotify.error('Date is required!', 'Oops!');
      return false;
    }
    if (!this.aboutEventForm.value.date[1] || this.aboutEventForm.value.date[1] == '') {
      this._sNotify.error('End date is required!', 'Oops!');
      return false;
    }
    if (!this.aboutEventForm.value.start_time || this.aboutEventForm.value.start_time === "") {
      this._sNotify.error('Start Time is required!', 'Oops!');
      return false;
    }
    if (!this.aboutEventForm.value.end_time || this.aboutEventForm.value.end_time === "") {
      this._sNotify.error('End Time is required!', 'Oops!');
      return false;
    }
    if (this.aboutEventForm.value.end_time <= this.aboutEventForm.value.start_time) {
      this._sNotify.error('End time should always greater than Start time!', 'Oops!');
      return false;
    }
    return true;
  }

  next(): void {
    if (!this.validate()) {
      return;
    }
    const preparedAboutEventObj = this.prepareAboutEventObj(this.aboutEventForm.value);
    this.eventObj.about_event = preparedAboutEventObj;

    JSON.stringify({about_event: preparedAboutEventObj});
    localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    this._router.navigate(['/create-event/arrangement']);
  }

  prepareAboutEventObj(aboutEventObj: any): any {
    const preparedAboutEventObj: any = {};
    preparedAboutEventObj.event_start_date = aboutEventObj.date[0];
    preparedAboutEventObj.event_end_date = aboutEventObj.date[1];
    preparedAboutEventObj.event_start_time = this.prepareTime(aboutEventObj.start_time);
    preparedAboutEventObj.event_end_time = this.prepareTime(aboutEventObj.end_time);
    preparedAboutEventObj.about_event = aboutEventObj.about_event;
    return preparedAboutEventObj;
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return dateWithTime.getHours() + ':' + dateWithTime.getMinutes();
    }
  }

}
