import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
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
  perPageLimit: any = 4;
  offset: any = 1;

  constructor(
    private _eventService: EventService,
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _primengConfig: PrimeNGConfig,
  ) {
  }

  ngOnInit(): void {
    this.selectedEventIds = [];
    localStorage.removeItem('eId');
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
    this.perPageLimit = event ? (event.rows) : this.perPageLimit;
    this.offset = ((this.perPageLimit * page) - this.perPageLimit) + 1;

    const filter: any = {
      page : 1,
      limit : 10,
      search: ""
    }
    this._eventService.eventsList(filter).subscribe((result: any) => {
      this.pTotal = result.total;
      this.events = result.Data.docs;      
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
      this._router.navigate(['/events/create']);
    }
  }

  editEvent(event: any, eventId: any): void {
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/events/create/add-event']);
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
