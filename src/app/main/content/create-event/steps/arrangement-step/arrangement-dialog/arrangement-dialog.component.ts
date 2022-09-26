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
  constants: any = CONSTANTS;
  preparedSeatingItems: any = [];
  seatingForm: any;
  selectedTab = 0;
  totalArrangementsObj: any = {};

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
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
        // if (this.seatingForm.value && this.seatingForm.value.seating_item &&
        //   this.seatingForm.value.seating_item !== CONSTANTS.seatingType.CHAIR && this.seatingForm.value.seating_item !== CONSTANTS.seatingType.STAND) {
        //
        // } else {
          this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item * arrangement.per_seating_person));
          this.arrangements.controls[index].get('per_person_price')?.setValue(Number((arrangement.per_seating_price / arrangement.per_seating_person).toFixed(2)));
          this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.per_seating_price * arrangement.number_of_seating_item));
        // }
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
    console.log(this.seatingForm.value);
  }

  private _prepareArrangementForm(): void {
    this.seatingForm = this._formBuilder.group({
      seating_item: [''],
      arrangements: this._formBuilder.array([]),
      food: ['', [Validators.required]],
      food_description: [''],
      equipment: ['', [Validators.required]],
      equipment_description: [''],
    });
    this.addArrangements();
  }

}
