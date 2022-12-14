import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-arrangement-dialog',
  templateUrl: './arrangement-dialog.component.html',
  styleUrls: ['./arrangement-dialog.component.scss']
})
export class ArrangementDialogComponent implements OnInit {
  constants: any = CONSTANTS;
  seatingForm: any;
  seatingLocationIcon: any;
  selectedTab = 0;
  totalArrangementsObj: any = {};
  selectedSeatingObj: any = {};
  isInitial: boolean = true;

  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  @Input() arrangementsArr: any = {};
  @Input() popClass: any;
  @Input() seatingItems: any;
  @Input() editArrangementObj: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() addEditArrangement: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.isInitial = true;
    this._prepareArrangementForm();
    this.prepareSeatingItems();
    if (this.editArrangementObj && this.editArrangementObj.seating_item) {
      this.selectedSeatingObj = this.editArrangementObj.seating_item;
    }
  }
  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  get arrangements() {
    return this.seatingForm.get('arrangements');
  }

  addArrangements(tempArrangementObj: any = {}): void {
    const arrangementsObj = this._formBuilder.group({
      number_of_seating_item: [tempArrangementObj?.number_of_seating_item || 0, [Validators.required, Validators.min(1)]],
      vertical_location: [tempArrangementObj?.vertical_location || this.constants.verticalLocationsArr[this.constants.verticalLocationsObj.TOP].value, [Validators.required, Validators.min(1)]],
      horizontal_location: [tempArrangementObj?.horizontal_location || this.constants.horizontalLocationsArr[this.constants.horizontalLocationsObj.NONE].value, [Validators.required, Validators.min(1)]],
      per_seating_person: [tempArrangementObj?.per_seating_person || 0],
      total_person: [tempArrangementObj?.total_person || 0, [Validators.required, Validators.min(1)]],
      per_seating_price: [tempArrangementObj?.per_seating_price || 0],
      per_person_price: [tempArrangementObj?.per_person_price || 0, [Validators.required, Validators.min(1)]],
      total_amount: [tempArrangementObj?.total_amount || 0, [Validators.required, Validators.min(1)]],
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
    this.totalArrangementsObj = {
      total_number_of_seating_items: 0,
      total_per_seating_persons: 0,
      total_persons: 0,
      per_seating_price: 0,
      per_person_price: 0,
      total_amount: 0,
      total_booked: 0
    };
    _.each(this.arrangements.value, (arrangement: any, index: number) => {
      if (arrangement.number_of_seating_item && arrangement.per_seating_person) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item * arrangement.per_seating_person));
        this.arrangements.controls[index].get('per_person_price')?.setValue(Number((arrangement.per_seating_price / arrangement.per_seating_person).toFixed(2)));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.per_seating_price * arrangement.number_of_seating_item));
      } else if (this.selectedSeatingObj && (this.selectedSeatingObj.itemname == 'Chair' || this.selectedSeatingObj.itemname == 'chair' || this.selectedSeatingObj.itemname == 'Stand' || this.selectedSeatingObj.itemname == 'stand')) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.number_of_seating_item * arrangement.per_person_price));
        this.arrangements.controls[index].get('booking_acceptance')?.setValue(true);
      }
    });
    _.each(this.arrangements.value, (arrangement: any) => {
      this.totalArrangementsObj.total_number_of_seating_items += Number(arrangement?.number_of_seating_item || 0);
      this.totalArrangementsObj.total_per_seating_persons += Number(arrangement?.per_seating_person || 0);
      this.totalArrangementsObj.total_persons += Number(arrangement?.total_person || 0);
      this.totalArrangementsObj.per_seating_price += Number(arrangement?.per_seating_price || 0);
      this.totalArrangementsObj.per_person_price += Number(arrangement?.per_person_price || 0);
      this.totalArrangementsObj.total_amount += Number(arrangement?.total_amount || 0);
    });    
  }

  prepareSeatingItems(): void {
    if (this.isInitial && this.arrangementsArr && this.arrangementsArr.length &&
      (!this.editArrangementObj || !this.editArrangementObj.seating_item)) {
      const arrangementKeys = Object.keys(_.keyBy(this.arrangementsArr, 'seating_item._id'));
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
    if (this.selectedSeatingObj && (this.selectedSeatingObj.itemname !== 'Chair' && this.selectedSeatingObj.itemname !== 'chair') && (this.selectedSeatingObj.itemname != 'Stand' && this.selectedSeatingObj.itemname != 'stand')) {
     Object.keys(this.arrangements.controls).forEach((key) => {
      Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
        if (subKey == 'per_seating_person') {
          this.arrangements.controls[key].get('per_seating_person').setValidators([Validators.required, Validators.min(1)]);
          this.arrangements.controls[key].get('per_seating_person').updateValueAndValidity();
          this.arrangements.controls[key].get('per_seating_price').setValidators([Validators.required, Validators.min(1)]);
          this.arrangements.controls[key].get('per_seating_price').updateValueAndValidity();
        }
      });
    });
    }
  }

  selectItems(): void {
    if (this.seatingForm.invalid) {
      Object.keys(this.seatingForm.controls).forEach((key) => {
        this.seatingForm.controls[key].touched = true;
        this.seatingForm.controls[key].markAsDirty();
      });


      // if (this.arrangements && this.arrangements.controls && this.arrangements.controls.length && this.arrangements.controls[key] && this.arrangements.controls[key].controls) {
      //   Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
      //     this.arrangements.controls[key].controls[subKey].touched = true;
      //     this.arrangements.controls[key].controls[subKey].markAsDirty();
      //   });
      // }

      Object.keys(this.arrangements.controls).forEach((key) => {
        Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
          this.arrangements.controls[key].controls[subKey].touched = true;
          this.arrangements.controls[key].controls[subKey].markAsDirty();
        });
      });
      
      return;
    }
    this.selectedTab = 1
  }

  addFormData(): void {
    if (!this.arrangementsArr || !this.arrangementsArr.length) {
      this.arrangementsArr = [];
    }

    let preparedSeatingArr: any = this.arrangementsArr || [];
    if (this.editArrangementObj && this.editArrangementObj.seating_item) {
      preparedSeatingArr = [];
      _.each(this.arrangementsArr, (arrangement: any) => {
        if (this.editArrangementObj.seating_item != arrangement.seating_item) {
          preparedSeatingArr.push(arrangement);
        }
      });
    } else {
      preparedSeatingArr = this.arrangementsArr || [];
    }

    const seatingObj: any = this.seatingForm.value;
    seatingObj.totalCalculations = this.totalArrangementsObj;
    seatingObj.seating_item = (this.editArrangementObj && this.editArrangementObj.seating_item) ? this.editArrangementObj.seating_item : _.find(this.seatingItems, ['_id', seatingObj.seating_item]);
    seatingObj.seating_item_id = seatingObj.seating_item._id;
    preparedSeatingArr.push(seatingObj);
    this.arrangementsArr = preparedSeatingArr;
    this.closePopup(this.arrangementsArr);
  }

  closePopup(arrangementsArr: any = []): void {
    this.addEditArrangement.emit(arrangementsArr);
    this.isAddEventChange.emit(false);
  }

  private _prepareArrangementForm(): void {
    this.seatingForm = this._formBuilder.group({
      seating_item: [{ value: (this.editArrangementObj && this.editArrangementObj.seating_item) ?
          ((this.editArrangementObj.seating_item._id) ? this.editArrangementObj.seating_item._id : this.editArrangementObj.seating_item) : null, disabled: (this.editArrangementObj && this.editArrangementObj.seating_item) }, [Validators.required]],
      arrangements: this._formBuilder.array([]),
      food: [this.editArrangementObj?.food || 'VEG', [Validators.required]],
      food_description: [this.editArrangementObj?.food_description || ''],
      equipment: [(!!(this.editArrangementObj && this.editArrangementObj.equipment)), [Validators.required]],
      equipment_description: [this.editArrangementObj?.equipment_description || null],
    });
    if (this.editArrangementObj && this.editArrangementObj.arrangements) {
      _.each(this.editArrangementObj.arrangements, (arrangement: any) => {
        this.addArrangements(arrangement);
      });
    } else {
      this.addArrangements();
    }
  }
}