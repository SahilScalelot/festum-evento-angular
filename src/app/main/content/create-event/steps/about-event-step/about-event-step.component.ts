import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-about-event-step',
  templateUrl: './about-event-step.component.html',
  styleUrls: ['./about-event-step.component.scss']
})
export class AboutEventStepComponent implements OnInit {
  minDateValue: any = new Date();
  aboutEventForm: any;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
  ) {
  }

  ngOnInit(): void {
    this._prepareAboutEventForm(this.eventObj);
    // this.prepareEventObj();
  }

  prepareEventObj(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    } else {
      this._router.navigate(['/events']);
    }
    // this._globalService.addEditEvent$.subscribe((eventObj: any) => {
    //   if (eventObj) {
    //     this.eventObj = eventObj;
    //     this._prepareAboutEventForm(this.eventObj);
    //   }
    // });
    // if (!this.eventObj || !this.eventObj.add_event) {
    //   this._router.navigate(['/events']);
    // }
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

    this.eventObj.about_event = this.prepareAboutEventObj(this.aboutEventForm.value);
    // localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    // this._globalService.addEditEvent$.next(this.eventObj);
    this.newEventObj.emit(this.eventObj);
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
