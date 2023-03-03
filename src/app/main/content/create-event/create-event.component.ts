import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { GlobalService } from "../../../services/global.service";
import { NavigationEnd, Router } from "@angular/router";
import { CreateEventService } from "./create-event.service";
import { EventService } from '../event/event.service';
import * as _ from 'lodash';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  items: MenuItem[] | any;
  hiddenDiscountItems: MenuItem[] | any;
  isAddArrangement: boolean = false;
  currentURL: any = '';
  eventObj: any = {};
  eventId: any = '';
  isReadonly: any = '';
  isHideDiscountitem: any = false;

  constructor(
    private _eventService: EventService,
    public _globalService: GlobalService,
    public _globalFunctions: GlobalFunctions,
    private _router: Router,
    private _createEventService: CreateEventService
  ) {
    _router.events.subscribe((event: any) => {
      this.isAddArrangement = (!this.isAddArrangement && event.url && event.url.includes('/events/create/arrangement'));
      if (event instanceof NavigationEnd) {
        this.currentURL = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    } else {
      this.eventId = localStorage.getItem('eId');
    }
    this._globalService.isHideDiscountitem$.subscribe((isHideDiscountitem: boolean = false) => {
      this.isHideDiscountitem = isHideDiscountitem;
    });

    this.items = this._globalFunctions.copyObject(CONSTANTS.eventStepsArr);
    const hiddenDiscountItems = this._globalFunctions.copyObject(CONSTANTS.eventStepsArr);
    const indexOfDiscount = _.findIndex(this.items, ['routerLink', 'discount']);
    if (indexOfDiscount != -1) {
      hiddenDiscountItems.splice(indexOfDiscount, 1);
    }
    this.hiddenDiscountItems = this._globalFunctions.copyObject(hiddenDiscountItems);
    this.getEvent();
  }

  openAddArrangementDialog(): void {
    this._createEventService.isOpenAddEditArrangementDialog$.next(true);
  }

  getEvent(): void {
    this._eventService.getSingleEvents(this.eventId).subscribe((result: any) => {
      const condata = result?.Data;
      this.isReadonly = 
      !((condata?.about?._id != "") && 
      (condata?.banner != "") && 
      (condata?.discounts?.length) && 
      (condata?.event_location?._id != "") && 
      (condata?.permission_letter != "") && 
      (condata?.seating_arrangements?.length));
      this.isHideDiscountitem = (!condata.accept_booking);
      this._globalService.isHideDiscountitem$.next(this.isHideDiscountitem);
    });
  }

}
