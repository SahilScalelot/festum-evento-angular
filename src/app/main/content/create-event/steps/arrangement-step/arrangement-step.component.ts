import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
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
  editArrangementObj: any = {};
  eventId: any = '';
  isLoading: boolean = false;
  arrangementsArr: any = [];
  
  @Input() arrangementObj: any = {};

  constructor(
    public _globalFunctions: GlobalFunctions,
    public _router: Router,
    private _createEventService: CreateEventService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this.editArrangementObj = {};
    this.getArrangements();
    // this.prepareArrangementObj();
    this.getSeatingItems();
    
    this._createEventService.isOpenAddEditArrangementDialog$.subscribe((isOpenAddEditArrangementDialog: boolean) => {
      this.isArrangement = isOpenAddEditArrangementDialog;
    });
    this.isArrangement = false;
  }

  getArrangements(): void {
    this.isLoading = true;
    this._createEventService.getArrangements(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.arrangementsArr = result.Data.arrangements || [];
      //   this.arrangementsArr = [
      //     {
      //         "seating_item": "637dc1ace3a8bce0935160da",
      //         "arrangements": [
      //             {
      //                 "number_of_seating_item": 0,
      //                 "vertical_location": "TOP",
      //                 "horizontal_location": "NONE",
      //                 "per_seating_person": 0,
      //                 "total_person": 0,
      //                 "per_seating_price": 0,
      //                 "per_person_price": 0,
      //                 "total_amount": 0,
      //                 "description": "",
      //                 "booking_acceptance": false
      //             }
      //         ],
      //         "food": "VEG",
      //         "food_description": "",
      //         "equipment": false,
      //         "equipment_description": null,
      //         "totalCalculations": {
      //             "total_number_of_seating_items": 0,
      //             "total_per_seating_persons": 0,
      //             "total_persons": 0,
      //             "per_seating_price": 0,
      //             "per_person_price": 0,
      //             "total_amount": 0,
      //             "total_booked": 0
      //         },
      //         "seat_item_obj": {
      //             "_id": "637dc1ace3a8bce0935160da",
      //             "createdBy": "637b0cf22d89166c49573d39",
      //             "updatedBy": "637b0cf22d89166c49573d39",
      //             "itemname": "Sofa",
      //             "itemimage": "637477038e96c599daafa8f0/event/IMG/IMG-6003094906743134.png",
      //             "description": "testing item as Sofa",
      //             "status": true,
      //             "createdAt": "2022-11-23T06:46:04.552Z",
      //             "updatedAt": "2022-11-23T06:46:04.552Z",
      //             "__v": 0
      //         }
      //     }
      // ];
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  getSeatingItems(): void {
    this.isLoading = true;
    this._createEventService.getSeatingItems().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.seatingItems = result.Data || [];
        this.tmpSeatingItems = this._globalFunctions.copyObject(this.seatingItems);
        this.isLoading = false;
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
      this.arrangementsArr[index].isActive = !this.arrangementsArr[index].isActive;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  openArrangementPopup(arrangementObj: any = {}): void {
    this.editArrangementObj = arrangementObj;
    this.isArrangement = true;
  }

  deleteArrangement(occasionId: any = ''): void {
    // const eventObj: any = this._globalFunctions.copyObject(this.eventObj || {});
    // this.eventObj.arrangements = _.remove(eventObj.arrangements, (arrangement: any) => {
    //   return arrangement.seat_id != occasionId;
    // });
    // this.prepareArrangementObj();
  }

  closePop(flag: boolean): void {
    this.seatingItems = this._globalFunctions.copyObject(this.tmpSeatingItems);
    this.editArrangementObj = {};
    this.isArrangement = flag;
    // this.prepareArrangementObj();
  }

  addEditArrangement(addEditArrangement: any = {}): void {
    if (addEditArrangement && addEditArrangement.seating_item) {
      console.log(addEditArrangement);
      this.arrangementsArr.push(addEditArrangement);
    }
  }

  onNextStep(): void {
    // this.newEventObj.emit(this.eventObj);
  }

  prepareArrangementObj(): void {
    if (this.arrangementObj) {
      const preparedOccasionArr: any = [];
      const occasionGroupBySeatingId: any = _.groupBy(this.arrangementObj.arrangements, 'seat_id');
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
      this.arrangementsArr = preparedOccasionArr;
    } else {
      this._router.navigate(['/events']);
    }
  }
}
