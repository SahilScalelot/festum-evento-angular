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
  eventObj: any = {};

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
    } else {
      this._router.navigate(['/events']);
    }
    this.aboutEventForm = this._formBuilder.group({
      date: [this.eventObj && this.eventObj.about_event && this.eventObj.about_event.event_start_date ? 
        [new Date(this.eventObj?.about_event?.event_start_date), new Date(this.eventObj?.about_event?.event_end_date)] : '', [Validators.required]],
      start_time: [this.eventObj?.about_event?.event_start_time, [Validators.required]],
      end_time: [this.eventObj?.about_event?.event_end_time, [Validators.required]],
      about_event: [this.eventObj?.about_event?.about_event],
    });
  }

  next(): void {
    // if (!this.validate()) {
    //   return;
    // }
    if (this.aboutEventForm.invalid) {
      Object.keys(this.aboutEventForm.controls).forEach((key) => {
        this.aboutEventForm.controls[key].touched = true;
        this.aboutEventForm.controls[key].markAsDirty();
      });
      return;
    }

    const preparedAboutEventObj = this.prepareAboutEventObj(this.aboutEventForm.value);
    this.eventObj.about_event = preparedAboutEventObj;

    JSON.stringify({about_event: preparedAboutEventObj});
    localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    this._router.navigate(['/create-event/arrangement']);

    // console.log(this.aboutEventForm);
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
