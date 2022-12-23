import {Component, OnInit} from '@angular/core';
import {CONSTANTS} from '../../common/constants';
import {EventService} from './event.service';
import {GlobalFunctions} from "../../common/global-functions";
import {Router} from "@angular/router";
import * as _ from "lodash";
import { PrimeNGConfig } from 'primeng/api';

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

  pTotal: any;
  paging: any;
  perPageLimit: any = 4;
  offset: any = 1;

  constructor(
    private _eventService: EventService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _primengConfig: PrimeNGConfig,
  ) {
  }

  ngOnInit(): void {
    this.selectedEventIds = [];
    this._globalFunctions.removeIdsFromLocalStorage();
    this.getEvent();
    this._primengConfig.ripple = true;
  }

  // paginate(event: any) {
  //   const page = event.page + 1;
  //   this.perPageLimit = event.rows;
  //   this.getEvent(this.perPageLimit, page);
  //   console.log(page, this.perPageLimit);
  //   this.offset = ((this.perPageLimit * page) - this.perPageLimit) + 1;
  // }

  getEvent(event: any = ''): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    // this.perPageLimit = event ? (event.rows) : this.perPageLimit;
    // this.offset = ((this.perPageLimit * page) - this.perPageLimit) + 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '4',
      search: ""
    };
    this._eventService.eventsList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.paging = result.Data;
        this.events = result.Data.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
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
    if (localStorage.getItem('eId')) {
      this._router.navigate(['/events/create/add-event']);
    }
  }

  editEvent(event: any, eventId: any): void {
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/events/create/add-event']);
  }

  liveEvent(event: any, eventObj: any): void {
    event.stopPropagation();
    if (eventObj.is_approved) {
      this.isLoading = true;
      this._eventService.liveEventById(eventObj._id).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          // this.paging = result.Data;
          // this.events = result.Data.docs;
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
  }
  
  multipleLiveEvent(): void {
    this.isLoading = true;
    this._eventService.liveMultipleEvents(this.selectedEventIds).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        // this.selectedEventIds.forEach((eventId: any) => {
        //   const getObj: any = _.find(this.events, ["id", eventId]);
        //   getObj.live = true;
        // });
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

  gotoEventOverview(event: any, eventObj: any): void {
    event.stopPropagation();
    this._router.navigate(['/events/' + eventObj.id]);
  }

}
