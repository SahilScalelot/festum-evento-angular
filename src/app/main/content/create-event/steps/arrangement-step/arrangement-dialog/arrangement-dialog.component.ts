import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CONSTANTS} from 'src/app/main/common/constants';
import {FormBuilder, Validators} from "@angular/forms";

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
  isArrangement: boolean = false;
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

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

}
