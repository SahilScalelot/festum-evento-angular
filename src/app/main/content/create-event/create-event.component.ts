import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { GlobalService } from "../../../services/global.service";
import { NavigationEnd, Router } from "@angular/router";
import { CreateEventService } from "./create-event.service";
import { EventService } from '../event/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  items: MenuItem[] | any;
  isAddArrangement: boolean = false;
  currentURL: any = '';
  eventObj: any = {};
  eventId: any = '';
  isReadonly: any = '';

  constructor(
    private _eventService: EventService,
    public _globalService: GlobalService,
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
    this.items = [
      {
        label: 'Add Event',
        routerLink: 'add-event'
      },
      {
        label: 'About Event',
        routerLink: 'about-event'
      },
      {
        label: 'Arrangement',
        routerLink: 'arrangement'
      },
      {
        label: 'Location',
        routerLink: 'location'
      },
      {
        label: 'Photos & Videos',
        routerLink: 'photos-and-videos'
      },
      {
        label: 'Permission',
        routerLink: 'permission'
      },
      {
        label: 'Discount',
        routerLink: 'discount'
      },
      {
        label: 'Company Details',
        routerLink: 'company-details'
      },
      {
        label: 'Personal Details',
        routerLink: 'personal-details'
      },
      {
        label: 'Terms & Conditions',
        routerLink: 'terms-and-conditions'
      }
    ];
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
      (condata?.companydetail?._id != "") && 
      (condata?.discounts?.length) && 
      (condata?.event_location?._id != "") && 
      (condata?.permission_letter != "") && 
      (condata?.personaldetail?._id != "") && 
      (condata?.seating_arrangements?.length) && 
      (condata?.tandc?._id != ""));
    });
  }

}
