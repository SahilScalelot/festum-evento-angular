import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Subscription} from "rxjs";
import {GlobalService} from "../../../services/global.service";
import {Router} from "@angular/router";
import {CreateEventService} from "./create-event.service";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  items: MenuItem[] | any;
  subscription: Subscription | any;
  isAddArrangement: boolean = false;

  constructor(public _globalService: GlobalService, private _router: Router, private _createEventService: CreateEventService) {
    _router.events.subscribe((event: any) => {
      this.isAddArrangement = (!this.isAddArrangement && event.url && event.url.includes('/create-event/arrangement'));
    });
  }

  ngOnInit(): void {
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

    this.subscription = this._globalService.paymentComplete$.subscribe((personalInformation) => {
      console.log('test');
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openAddArrangementDialog(): void {
    this._createEventService.isOpenAddEditArrangementDialog$.next(true);
  }

}
