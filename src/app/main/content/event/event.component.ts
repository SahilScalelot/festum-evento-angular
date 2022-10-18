import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
import {CONSTANTS} from '../../common/constants';
import {EventService} from './event.service';
import {GlobalFunctions} from "../../common/global-functions";
import {Router} from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  isAddEvent: boolean = false;
  events: any = [];
  constants: any = CONSTANTS;  
  isLoading: boolean = false;  
  selectedEventIds: any = [];

  constructor(
    private _eventService: EventService,
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
  ) {
  }

  ngOnInit(): void {
    this.selectedEventIds = [];
    localStorage.removeItem('newEventObj');
    this.getEvent();
  }

  getEvent(): void {    
    this.isLoading = true;
    this._eventService.retrieveEvents().subscribe((result: any) => {
      this.events = result.events;
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
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
    this._router.navigate(['/edit-event/' + eventObj.id]);
  }

  liveEvent(event: any, eventObj: any): void {
    event.stopPropagation();
  }
  
  multipleLiveEvent(): void {
    this.selectedEventIds.forEach((eventId: any) => {
      const getObj: any = _.find(this.events, ["id", eventId]);
      getObj.live = true;
    });
  }

  gotoEventOverview(event: any, eventObj: any): void {
    event.stopPropagation();
    this._router.navigate(['/event/' + eventObj.id]);
  }

}
