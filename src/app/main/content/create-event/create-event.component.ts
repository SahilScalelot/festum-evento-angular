import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Subscription} from "rxjs";
import {GlobalService} from "../../../services/global.service";
import {NavigationEnd, Router} from "@angular/router";
import {CreateEventService} from "./create-event.service";

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

  constructor(public _globalService: GlobalService, private _router: Router, private _createEventService: CreateEventService) {
    _router.events.subscribe((event: any) => {
      this.isAddArrangement = (!this.isAddArrangement && event.url && event.url.includes('/events/create/arrangement'));
      if (event instanceof NavigationEnd) {
        this.currentURL = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    this.prepareEventObj();
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
  }

  prepareEventObj(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    } else {
      this._router.navigate(['/events']);
    }
  }

  openAddArrangementDialog(): void {
    this._createEventService.isOpenAddEditArrangementDialog$.next(true);
  }

}
