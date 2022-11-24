import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';

@Component({
  selector: 'app-arrangement-dialog',
  templateUrl: './arrangement-dialog.component.html',
  styleUrls: ['./arrangement-dialog.component.scss']
})
export class ArrangementDialogComponent implements OnInit {
  constants: any = CONSTANTS;
  seatingForm: any;
  selectedTab = 0;
  totalArrangementsObj: any = {};
  selectedSeatingObj: any = {};
  isInitial: boolean = true;

  @Input() eventObj: any = {};
  @Input() popClass: any;
  @Input() seatingItems: any;
  @Input() arrangementObj: any;
  @Input() editArrangementObj: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.isInitial = true;
    this._prepareArrangementForm();
    this.prepareSeatingItems();
    if (this.arrangementObj && this.arrangementObj.seat) {
      this.selectedSeatingObj = this.arrangementObj.seat;
    }
  }

  get arrangements() {
    return this.seatingForm.get('arrangements') as FormArray;
  }

  addArrangements(tempArrangementObj: any = {}): void {
    const arrangementsObj = this._formBuilder.group({
      number_of_seating_item: [tempArrangementObj?.no_of_seat || 0],
      vertical_location: [tempArrangementObj?.seat_location || this.constants.verticalLocationsArr[this.constants.verticalLocationsObj.TOP].value],
      horizontal_location: [tempArrangementObj?.seat_side || this.constants.horizontalLocationsArr[this.constants.horizontalLocationsObj.NONE].value],
      per_seating_person: [tempArrangementObj?.table_person_capacity || 0],
      total_person: [tempArrangementObj?.person_capacity || 0],
      per_seating_price: [tempArrangementObj?.table_price || 0],
      per_person_price: [tempArrangementObj?.price_per_seat || 0],
      total_amount: [tempArrangementObj?.total_booking_count || 0],
      description: [tempArrangementObj?.description || ''],
      booking_acceptance: [tempArrangementObj?.booking_acceptance || false],
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
      } else if (this.selectedSeatingObj && (this.selectedSeatingObj.itemname == 'Chair' || this.selectedSeatingObj.itemname == 'chair' || this.selectedSeatingObj.itemname == 'Stands' || this.selectedSeatingObj.itemname == 'stands')) {
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.number_of_seating_item * arrangement.per_person_price));
      }
    });
    this.totalArrangementsObj.total_number_of_seating_items = _.sumBy(this.arrangements.value, 'number_of_seating_item');
    this.totalArrangementsObj.total_per_seating_persons = _.sumBy(this.arrangements.value, 'per_seating_person');
    this.totalArrangementsObj.total_persons = _.sumBy(this.arrangements.value, 'total_person');
    this.totalArrangementsObj.per_seating_price = _.sumBy(this.arrangements.value, 'per_seating_price');
    this.totalArrangementsObj.per_person_price = _.sumBy(this.arrangements.value, 'per_person_price');
    this.totalArrangementsObj.total_amount = _.sumBy(this.arrangements.value, 'total_amount');
    this.totalArrangementsObj.total_booked = 0;
  }

  prepareSeatingItems(): void {
    if (this.isInitial && this.eventObj && this.eventObj.arrangements && this.eventObj.arrangements.length &&
      (!this.arrangementObj || !this.arrangementObj.seating_item)) {        
      const arrangementKeys = Object.keys(_.keyBy(this.eventObj.arrangements, '_id'));
      _.each(arrangementKeys, (key: any) => {
        this.seatingItems = _.remove(this.seatingItems, (seatingItem: any) => { return seatingItem._id != key; });
      });
      this.isInitial = false;
    }
  }

  onSeatingItemChange(): void {
    this.selectedSeatingObj = _.find(this.seatingItems, ['_id', this.seatingForm.get('seating_item').value]);
    this.arrangements.controls = [];
    this.addArrangements();
  }

  addFormData(): void {
    if (this.eventObj && (!this.eventObj.arrangements || !this.eventObj.arrangements.length)) {
      this.eventObj.arrangements = [];
    }

    let preparedSeatingArr: any = this.eventObj?.arrangements || [];
    if (this.arrangementObj && this.arrangementObj.seating_item) {
      preparedSeatingArr = [];
      _.each(this.eventObj.arrangements, (arrangement: any) => {
        if (this.arrangementObj.seating_item != arrangement.seat_id) {
          preparedSeatingArr.push(arrangement);
        }
      });
    } else {
      preparedSeatingArr = this.eventObj?.arrangements || [];
    }

    const seatingObj: any = this.seatingForm.value;
    seatingObj.totalCalculations = this.totalArrangementsObj;
    console.log(seatingObj);
    // _.each(seatingObj.arrangements, (arrangement: any) => {
    //   const preparedArrangementObj: any = {};
    //   preparedArrangementObj.seat_id = (this.arrangementObj && this.arrangementObj.seating_item) ? this.arrangementObj.seating_item : seatingObj.seating_item;
    //   preparedArrangementObj.seat = (this.arrangementObj && this.arrangementObj.seat) ? this.arrangementObj.seat : _.find(this.seatingItems, ['_id', seatingObj.seating_item]);
    //   preparedArrangementObj.name = preparedArrangementObj?.seat?.itemname;
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
    // this.closePopup();
  }

  closePopup(): void {
    this.newEventObj.emit(this.eventObj);
    this.isAddEventChange.emit(false);
  }

  private _prepareArrangementForm(): void {
    this.seatingForm = this._formBuilder.group({
      seating_item: [{ value: this.arrangementObj?.seating_item || null, disabled: (this.arrangementObj && this.arrangementObj.seating_item) }, [Validators.required]],
      arrangements: this._formBuilder.array([]),
      food: [this.arrangementObj?.food || 'VEG', [Validators.required]],
      food_description: [this.arrangementObj?.food_description || ''],
      equipment: [(!!(this.arrangementObj && this.arrangementObj.equipment)), [Validators.required]],
      equipment_description: [this.arrangementObj?.equipment_description || null],
    });
    if (this.arrangementObj && this.arrangementObj.arrangements) {
      _.each(this.arrangementObj.arrangements, (arrangement: any) => {
        this.addArrangements(arrangement);
      });
    } else {
      this.addArrangements();
    }
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