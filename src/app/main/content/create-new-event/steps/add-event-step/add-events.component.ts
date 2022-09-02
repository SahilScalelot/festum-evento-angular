import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
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

  constructor(private _sNotifyService: SnotifyService, private _router: Router) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      const event = JSON.parse(eventString);
      console.log(event);
    }
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

  editEvent(eventObj: any): void {
    this.selectedEventObj = eventObj;
    this.isEditEvent = true;
  }

  deleteEvent(eventId: number): void {
    console.log(eventId);
  }

}
