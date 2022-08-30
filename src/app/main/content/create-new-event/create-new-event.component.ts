import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Subscription} from "rxjs";
import {GlobalService} from "../../../services/global.service";

@Component({
  selector: 'app-create-new-event',
  templateUrl: './create-new-event.component.html',
  styleUrls: ['./create-new-event.component.scss']
})
export class CreateNewEventComponent implements OnInit {
  popClass: string = 'active';
  isAddEvent: boolean = false;
  items: MenuItem[] | any;
  subscription: Subscription | any;

  constructor(public _globalService: GlobalService) {
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
}
