import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-event-step',
  templateUrl: './add-event-step.component.html',
  styleUrls: ['./add-event-step.component.scss']
})
export class AddEventStepComponent implements OnInit {
  isEditEvent: boolean = false;
  selectedEventIndex: number = 0;
  eventObj: any = {};

  constructor(private _globalService: GlobalService, private _sNotifyService: SnotifyService, private _router: Router) {
  }

  ngOnInit(): void {
    this.prepareEventObj();
  }

  next(): any {
    this._globalService.addEditEvent$.next(this.eventObj);
    this._router.navigate(['/create-event/about-event']);
  }

  prepareEventObj(): void {
    // if (localStorage.getItem('newEventObj')) {
    //   const eventString: any = localStorage.getItem('newEventObj');
    //   this.eventObj = JSON.parse(eventString);
    // } else {
    //   this._router.navigate(['/events']);
    // }
    this._globalService.addEditEvent$.subscribe((eventObj: any) => {
      if (eventObj) {
        this.eventObj = eventObj;
      }
    });
    if (!this.eventObj || !this.eventObj.add_event) {
      this._router.navigate(['/events']);
    }
  }

  deleteEvent(): void {
    // Open delete confirmation popup
    this._globalService.addEditEvent$.next(null);
    // localStorage.removeItem('newEventObj');
    this._router.navigate(['/events']);
  }

  closePop(flag: boolean): void {
    this.prepareEventObj();
    this.isEditEvent = flag;
  }

}
