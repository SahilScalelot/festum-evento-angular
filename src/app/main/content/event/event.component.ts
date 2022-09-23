import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
import {CONSTANTS} from '../../common/constants';
import {EventService} from './event.service';
import {GlobalFunctions} from "../../common/global-functions";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  isAddEvent: boolean = false;
  events: any = [];
  constants: any = CONSTANTS;

  constructor(
    private _eventService: EventService,
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
  ) {
  }

  ngOnInit(): void {
    localStorage.removeItem('newEventObj');
    this.getEvent();
  }

  getEvent(): void {
    this._eventService.retrieveEvents().subscribe((result: any) => {
      this.events = result.events;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  openAddEventDialog(): void {
    this.isAddEvent = true;
  }

  closePop(flag: boolean): void {
    this.isAddEvent = flag;
    if (localStorage.getItem('newEventObj')) {
      this._router.navigate(['/create-event']);
    }
  }

  editEvent(event: any, eventObj: any): void {
    event.stopPropagation();
    console.log(eventObj);
  }

  liveEvent(event: any, eventObj: any): void {
    event.stopPropagation();
  }
  
  multipleLiveEvent(event: any, eventObj: any): void {
    event.stopPropagation();
  }

  gotoEventOverview(event: any, eventObj: any): void {
    event.stopPropagation();
    this._router.navigate(['/event/' + eventObj.id]);
  }

}
