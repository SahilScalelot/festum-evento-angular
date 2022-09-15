import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CONSTANTS} from 'src/app/main/common/constants';
import {FormArray, FormBuilder, Validators} from "@angular/forms";

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

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.preparedSeatingItems = CONSTANTS.seatingItems;
    this.seatingForm = this._formBuilder.group({
      seating_item: [''],
      arrangements: this._formBuilder.array([
        this._formBuilder.group({
          number_of_seating_item: ['', [Validators.required]],
          vertical_location: [0, [Validators.required]],
          horizontal_location: [0, [Validators.required]],
          per_table_person: ['', [Validators.required]],
          total_person: ['', [Validators.required]],
          per_table_price: ['', [Validators.required]],
          per_person_price: ['', [Validators.required]],
          total_amount: ['', [Validators.required]],
          description: ['', [Validators.required]],
          booking_acceptance: [false],
        })
      ])
    });
  }

  get arrangements() {
    return this.seatingForm.get('arrangements') as FormArray;
  }

  addArrangements(tempArrangementObj: any = {}): void {
    if (Object.keys(tempArrangementObj).length === 0) {
      tempArrangementObj = {
        number_of_seating_item: '',
        vertical_location: 0,
        horizontal_location: 0,
        per_table_person: '',
        total_person: '',
        per_table_price: '',
        per_person_price: '',
        total_amount: '',
        description: '',
        booking_acceptance: false,
      };
    }

    const arrangementsObj = this._formBuilder.group({
      number_of_seating_item: [tempArrangementObj.number_of_seating_item],
      vertical_location: [tempArrangementObj.vertical_location],
      horizontal_location: [tempArrangementObj.horizontal_location],
      per_table_person: [tempArrangementObj.per_table_person],
      total_person: [tempArrangementObj.total_person],
      per_table_price: [tempArrangementObj.per_table_price],
      per_person_price: [tempArrangementObj.per_person_price],
      total_amount: [tempArrangementObj.total_amount],
      description: [tempArrangementObj.description],
      booking_acceptance: [tempArrangementObj.booking_acceptance],
    });
    this.arrangements.push(arrangementsObj);
  }

  removeArrangement(index: any): void {
    if (this.arrangements.get(index.toString())) {
      this.arrangements.removeAt(index.toString());
      this.arrangements.updateValueAndValidity();
    }
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

}
