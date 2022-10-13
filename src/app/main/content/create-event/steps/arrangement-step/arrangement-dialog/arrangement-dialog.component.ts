import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CONSTANTS} from 'src/app/main/common/constants';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import * as _ from 'lodash';

@Component({
  selector: 'app-arrangement-dialog',
  templateUrl: './arrangement-dialog.component.html',
  styleUrls: ['./arrangement-dialog.component.scss']
})
export class ArrangementDialogComponent implements OnInit {  
  @Input() popClass: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Input() seatingItems: any;
  constants: any = CONSTANTS;
  preparedSeatingItems: any = [];
  seatingForm: any;
  selectedTab = 0;
  totalArrangementsObj: any = {};
  eventObj: any = {};

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {    
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    }
    this.preparedSeatingItems = CONSTANTS.seatingItems;
    this._prepareArrangementForm();
  }

  get arrangements() {
    return this.seatingForm.get('arrangements') as FormArray;
  }

  addArrangements(tempArrangementObj: any = {}): void {
    if (Object.keys(tempArrangementObj).length === 0) {
      tempArrangementObj = {
        number_of_seating_item: 0,
        vertical_location: 0,
        horizontal_location: 0,
        per_seating_person: 0,
        total_person: 0,
        per_seating_price: 0,
        per_person_price: 0,
        total_amount: 0,
        description: '',
        booking_acceptance: false,
      };
    }

    const arrangementsObj = this._formBuilder.group({
      number_of_seating_item: [tempArrangementObj.number_of_seating_item],
      vertical_location: [tempArrangementObj.vertical_location],
      horizontal_location: [tempArrangementObj.horizontal_location],
      per_seating_person: [tempArrangementObj.per_seating_person],
      total_person: [tempArrangementObj.total_person],
      per_seating_price: [tempArrangementObj.per_seating_price],
      per_person_price: [tempArrangementObj.per_person_price],
      total_amount: [tempArrangementObj.total_amount],
      description: [tempArrangementObj.description],
      booking_acceptance: [tempArrangementObj.booking_acceptance],
    });
    this.arrangements.push(arrangementsObj);

    this.updateCalculatedValue();
  }

  removeArrangement(index: any): void {
    if (this.arrangements.get(index.toString())) {
      this.arrangements.removeAt(index.toString());
      this.arrangements.updateValueAndValidity();
      this.updateCalculatedValue();
    }
  }

  updateCalculatedValue(): void {
    _.each(this.arrangements.value, (arrangement: any, index: number) => {
      if (arrangement.number_of_seating_item && arrangement.per_seating_person) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item * arrangement.per_seating_person));
        this.arrangements.controls[index].get('per_person_price')?.setValue(Number((arrangement.per_seating_price / arrangement.per_seating_person).toFixed(2)));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.per_seating_price * arrangement.number_of_seating_item));
      }
    });
    this.totalArrangementsObj.totalNumberOfSeatingItems = _.sumBy(this.arrangements.value, 'number_of_seating_item');
    this.totalArrangementsObj.totalPerSeatingPersons = _.sumBy(this.arrangements.value, 'per_seating_person');
    this.totalArrangementsObj.totalPersons = _.sumBy(this.arrangements.value, 'total_person');
    this.totalArrangementsObj.per_seating_price = _.sumBy(this.arrangements.value, 'per_seating_price');
    this.totalArrangementsObj.per_person_price = _.sumBy(this.arrangements.value, 'per_person_price');
    this.totalArrangementsObj.total_amount = _.sumBy(this.arrangements.value, 'total_amount');
  }

  onSeatingItemChange(): void {
    this.arrangements.controls = [];
    this.addArrangements();
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

  addFormData(): void {
    // const preparedSeatingArr: any = this.eventObj.arrangements ? this.eventObj.arrangements : [];
    const seatingObj = this.seatingForm.value;
    console.log(seatingObj);
    
    // _.each(seatingObj.arrangements, (arrangement: any) => {
    //   const preparedArrangementObj: any = {};
    //   preparedArrangementObj.seat = {
    //     "id": CONSTANTS.seatingTypesObj[seatingObj.seating_item].value,
    //     "name": CONSTANTS.seatingTypesObj[seatingObj.seating_item].label,
    //     "svg": "/media/image/events/seating_arrangement/chair.svg",
    //   };
    //   preparedArrangementObj.name = '';
    //   preparedArrangementObj.no_of_seat = arrangement.number_of_seating_item;
    //   preparedArrangementObj.seat_location = arrangement.vertical_location;
    //   preparedArrangementObj.seat_side = arrangement.horizontal_location;
    //   preparedArrangementObj.table_person_capacity = arrangement.per_seating_person;
    //   preparedArrangementObj.person_capacity = arrangement.total_person;
    //   preparedArrangementObj.table_price = arrangement.per_seating_price;
    //   preparedArrangementObj.price_per_seat = arrangement.per_person_price;
    //   preparedArrangementObj.total_booking_count = arrangement.total_amount;
    //   preparedArrangementObj.description = arrangement.description;
    //   preparedArrangementObj.seat_food = seatingObj.food;
    //   preparedArrangementObj.seat_food_description = seatingObj.food_description;
    //   preparedArrangementObj.seat_equipment_description = seatingObj.equipment_description;
    //   preparedArrangementObj.booking_acceptance = arrangement.booking_acceptance ? 'PERPERSON' : 'PERTABLE';
    //   preparedArrangementObj.seat_equipment = seatingObj.equipment;

    //   preparedSeatingArr.push(preparedArrangementObj);
    // });
    // this.eventObj.arrangements = preparedSeatingArr;
    // console.log(seatingObj);
    // localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    this.closePopup();
  }

  private _prepareArrangementForm(): void {
    this.seatingForm = this._formBuilder.group({
      seating_item: ['', [Validators.required]],
      arrangements: this._formBuilder.array([]),
      food: ['VEG', [Validators.required]],
      food_description: [''],
      equipment: [false, [Validators.required]],
      equipment_description: [''],
    });
    this.addArrangements();
  }

}

// {
//   "seating_item": "2",
//   "arrangements": [
//       {
//           "number_of_seating_item": 10,
//           "vertical_location": "TOP",
//           "horizontal_location": "LEFT",
//           "per_seating_person": 3,
//           "total_person": 30,
//           "per_seating_price": 39,
//           "per_person_price": 13,
//           "total_amount": 390,
//           "description": "",
//           "booking_acceptance": false
//       },
//       {
//           "number_of_seating_item": 16,
//           "vertical_location": "BOTTOM",
//           "horizontal_location": "RIGHT",
//           "per_seating_person": 4,
//           "total_person": 64,
//           "per_seating_price": 21,
//           "per_person_price": 5.25,
//           "total_amount": 336,
//           "description": "",
//           "booking_acceptance": true
//       }
//   ],
//   "food": "VEG",
//   "food_description": "asdasd",
//   "equipment": false,
//   "equipment_description": "asdas"
// }