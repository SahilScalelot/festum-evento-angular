import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {CreateEventService} from "../../create-event.service";

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {
  isArrangement: boolean = false;
  occasion: any = [];
  eventObj: any = {};

  constructor(
    public _globalFunctions: GlobalFunctions,
    public _router: Router,
    private _createEventService: CreateEventService) {
  }

  ngOnInit(): void {
    // this.prepareArrangementObj();
    // this._globalFunctions.loadAccordion();
    this._createEventService.isOpenAddEditArrangementDialog$.subscribe((isOpenAddEditArrangementDialog: boolean) => {
      this.isArrangement = isOpenAddEditArrangementDialog;
    });

    this.occasion = [
      {
        "id": 1,
        "seat": {
          "id": 1,
          "name": "Chair",
          "svg": "/media/image/events/seating_arrangement/chair.svg",
          "timestamp": "2021-08-15T06:22:41.229676Z",
          "sequence": 1,
          "is_active": true
        },
        "name": "Best Chair",
        "no_of_seat": 50,
        "seat_location": "TOP",
        "seat_side": "LEFT",
        "table_person_capacity": 12,
        "person_capacity": 1,
        "table_price": 250,
        "price_per_seat": "350.50",
        "total_booking_count": 6,
        "description": "this is logn description for seat",
        "booking_acceptance": "",
        "seat_food": "VEG",
        "seat_food_description": "this is logn description for Food",
        "seat_equipment": true,
        "seat_equipment_description": "this is logn description for equipment",
        "occasion": 43
      },
      {
        "id": 2,
        "seat": {
          "id": 2,
          "name": "Table",
          "svg": "/media/image/events/seating_arrangement/chair.svg",
          "timestamp": "2021-08-15T06:22:41.229676Z",
          "sequence": 1,
          "is_active": true
        },
        "name": "Good Chair",
        "no_of_seat": 100,
        "seat_location": "CENTER",
        "seat_side": "NONE",
        "table_person_capacity": 12,
        "person_capacity": 1,
        "table_price": 250,
        "price_per_seat": "250.50",
        "total_booking_count": 12,
        "description": "this is logn description for seat",
        "booking_acceptance": "",
        "seat_food": "VEG",
        "seat_food_description": "this is logn description for Food",
        "seat_equipment": true,
        "seat_equipment_description": "this is logn description for equipment",
        "occasion": 43
      },
    ]
  }

  toggleAccordion(event: any, index: any): void {
    const element: any = event.target;
    const panel: any = element.nextElementSibling;

    if (panel && panel.style) {
      element.classList.toggle("active");
      this.occasion[index].isActive = !this.occasion[index].isActive;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  openAddEventDialog(): void {
    this.isArrangement = true;
  }

  closePop(flag: boolean): void {
    this.isArrangement = flag;
    this.prepareArrangementObj();
  }

  prepareArrangementObj(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
      this.occasion = this.eventObj.arrangements;
    } else {
      this._router.navigate(['/events']);
    }
  }
}
