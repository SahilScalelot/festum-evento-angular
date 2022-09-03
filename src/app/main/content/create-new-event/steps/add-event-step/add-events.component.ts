import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss']
})
export class AddEventsComponent implements OnInit {
  isEditEvent: boolean = false;
  events: any = [];
  selectedEventIndex: number = 0;
  selectedEventObj: any = {};
  newEventObj: any = {};

  constructor(private _globalService: GlobalService, private _sNotifyService: SnotifyService, private _router: Router) {
  }

  ngOnInit(): void {
    this.prepareEvent();
    this._globalService.addEditEvent$.subscribe((eventObj: any) => {
      if (eventObj) {
        this.events = eventObj.add_event;
      }
    });
  }

  selectEvent(eventObj: any, index: number): void {
    this.selectedEventIndex = index;
    this.selectedEventObj = eventObj;
  }

  next(): any {
    if (!this.selectedEventIndex) {
      this._sNotifyService.error('Please Select Event', 'Oops!');
    } else {
      this._router.navigate(['/create-event/about-event']);
    }
  }

  prepareEvent(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.newEventObj = JSON.parse(eventString);
      this.events = this.newEventObj.add_event;
    }
  }

  editEvent(eventObj: any): void {
    this.selectedEventObj = eventObj;
    this.isEditEvent = true;
  }

  deleteEvent(eventIndex: number): void {
    console.log(eventIndex);
    console.log(this.events.splice(eventIndex, 1));
    this.newEventObj.add_event = this.events
    localStorage.setItem('newEventObj', JSON.stringify(this.newEventObj));
  }

  closePop(flag: boolean): void {
    this.isEditEvent = flag;
    this.prepareEvent();
  }

}
