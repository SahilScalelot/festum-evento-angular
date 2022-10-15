import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CONSTANTS} from 'src/app/main/common/constants';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {CreateEventService} from "../../create-event.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {
  seatingItems: any = [];
  tmpSeatingItems: any = [];
  isArrangement: boolean = false;
  constants: any = CONSTANTS;
  occasions: any = [];
  arrangementObj: any = {};
  eventObj: any = {};

  constructor(
    public _globalFunctions: GlobalFunctions,
    public _router: Router,
    private _createEventService: CreateEventService) {
  }

  ngOnInit(): void {
    this.arrangementObj = {};
    this.prepareArrangementObj();
    // this._globalFunctions.loadAccordion();
    this.getSeatingItems();

    this._createEventService.isOpenAddEditArrangementDialog$.subscribe((isOpenAddEditArrangementDialog: boolean) => {
      this.isArrangement = isOpenAddEditArrangementDialog;
    });

    // this.occasions = [
    //   {
    //     "id": 1,
    //     "seat": {
    //       "id": 1,
    //       "name": "Chair",
    //       "svg": "/media/image/events/seating_arrangement/chair.svg",
    //       "timestamp": "2021-08-15T06:22:41.229676Z",
    //       "sequence": 1,
    //       "is_active": true
    //     },
    //     "name": "Best Chair",
    //     "no_of_seat": 50,
    //     "seat_location": "TOP",
    //     "seat_side": "LEFT",
    //     "table_person_capacity": 12,
    //     "person_capacity": 1,
    //     "table_price": 250,
    //     "price_per_seat": "350.50",
    //     "total_booking_count": 6,
    //     "description": "this is logn description for seat",
    //     "booking_acceptance": "",
    //     "seat_food": "VEG",
    //     "seat_food_description": "this is logn description for Food",
    //     "seat_equipment": true,
    //     "seat_equipment_description": "this is logn description for equipment",
    //     "occasion": 43
    //   },
    //   {
    //     "id": 2,
    //     "seat": {
    //       "id": 2,
    //       "name": "Chair",
    //       "svg": "/media/image/events/seating_arrangement/chair.svg",
    //       "timestamp": "2021-08-15T06:22:41.229676Z",
    //       "sequence": 1,
    //       "is_active": true
    //     },
    //     "name": "Good Chair",
    //     "no_of_seat": 100,
    //     "seat_location": "CENTER",
    //     "seat_side": "NONE",
    //     "table_person_capacity": 12,
    //     "person_capacity": 1,
    //     "table_price": 250,
    //     "price_per_seat": "250.50",
    //     "total_booking_count": 12,
    //     "description": "this is logn description for seat",
    //     "booking_acceptance": "",
    //     "seat_food": "VEG",
    //     "seat_food_description": "this is logn description for Food",
    //     "seat_equipment": true,
    //     "seat_equipment_description": "this is logn description for equipment",
    //     "occasion": 43
    //   },
    // ]
  }

  getSeatingItems(): void {
    this._createEventService.getSeatingItems().subscribe((result: any) => {
      if (result && result.status) {
        this.seatingItems = result.data || [];
        this.tmpSeatingItems = this._globalFunctions.copyObject(this.seatingItems);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  toggleAccordion(event: any, index: any): void {
    const element: any = event.target;
    const panel: any = element.nextElementSibling;

    if (panel && panel.style) {
      element.classList.toggle("active");
      this.occasions[index].isActive = !this.occasions[index].isActive;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  openArrangementPopup(occasionObj: any = {}): void {
    this.arrangementObj = occasionObj;
    this.isArrangement = true;
  }

  deleteArrangement(occasionId: any = ''): void {
    const eventString: any = localStorage.getItem('newEventObj');
    const eventObj: any = JSON.parse(eventString);
    this.eventObj.arrangements = _.remove(eventObj.arrangements, (arrangement: any) => {
      return arrangement.seat_id != occasionId;
    });
    localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    this.prepareArrangementObj();
  }

  closePop(flag: boolean): void {
    this.seatingItems = this._globalFunctions.copyObject(this.tmpSeatingItems);
    this.arrangementObj = {};
    this.isArrangement = flag;
    this.prepareArrangementObj();
  }

  prepareArrangementObj(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);

      const preparedOccasionArr: any = [];
      const occasionGroupBySeatingId: any = _.groupBy(this.eventObj.arrangements, 'seat_id');
      _.each(occasionGroupBySeatingId, (occasionGroup: any) => {
        const tmpOccasionObj: any = {};
        tmpOccasionObj.seat = occasionGroup[0].seat;
        tmpOccasionObj.seating_item = occasionGroup[0].seat_id;
        tmpOccasionObj.food = occasionGroup[0].seat_food;
        tmpOccasionObj.food_description = occasionGroup[0].seat_food_description;
        tmpOccasionObj.equipment = occasionGroup[0].seat_equipment;
        tmpOccasionObj.equipment_description = occasionGroup[0].seat_equipment_description;
        tmpOccasionObj.arrangements = [];
        _.each(occasionGroup, (arrangementObj: any) => {
          tmpOccasionObj.arrangements.push({
            no_of_seat: arrangementObj.no_of_seat,
            seat_location: arrangementObj.seat_location,
            seat_side: arrangementObj.seat_side,
            table_person_capacity: arrangementObj.table_person_capacity,
            person_capacity: arrangementObj.person_capacity,
            table_price: arrangementObj.table_price,
            price_per_seat: arrangementObj.price_per_seat,
            total_booking_count: arrangementObj.total_booking_count,
            description: arrangementObj.description,
            booking_acceptance: (arrangementObj.booking_acceptance == true || arrangementObj.booking_acceptance == 'PERPERSON'),
          });
        });
        preparedOccasionArr.push(tmpOccasionObj);
      });
      this.occasions = preparedOccasionArr;
      // this.occasions = this.eventObj.arrangements;
    } else {
      this._router.navigate(['/events']);
    }
  }
}
