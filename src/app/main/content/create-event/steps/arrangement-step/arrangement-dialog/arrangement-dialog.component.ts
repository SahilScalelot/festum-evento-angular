import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { SnotifyService } from "ng-snotify";
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateEventService } from '../../../create-event.service';

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
  isLoading: boolean = false;
  eventId: any;
  addEditEvent: any;


  
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  textEditorFood: boolean = false;
  textEditorEquipment: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit0;
  textEditorLimitFood: any = this.textEditorMaxLimit;
  textEditorLimitEquipment: any = this.textEditorMaxLimit;

  @Input() arrangementsArr: any = {};
  @Input() popClass: any;
  @Input() seatingItems: any;
  @Input() editArrangementObj: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() addEditArrangement: EventEmitter<any> = new EventEmitter();

  constructor(
    private _createEventService: CreateEventService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
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

  seattyp: any = [{seat:"VVIP"},{seat:"VIP"},{seat:"Platinum"},{seat:"Gold"},{seat:"Silver"}];
  
  // getEvent(eventId: any): any {
  //   this.isLoading = true;
  //   this._createEventService.getEvent(eventId).subscribe((result: any) => {
  //     if (result && result.IsSuccess) {
  //       this.addEditEvent = result.Data;
  //       this.isLoading = false;
  //     } else {
  //       this._globalFunctions.successErrorHandling(result, this, true);
  //       this.isLoading = false;
  //     }
  //   }, (error: any) => {
  //     this._globalFunctions.errorHanding(error, this, true);
  //     this.isLoading = false;
  //   });
  // }

  addArrangements(tempArrangementObj: any = {}): void {
    // this.eventId = localStorage.getItem('eId');
    // this.getEvent(this.eventId);
    const arrangementsObj = this._formBuilder.group({
      number_of_seating_item: [tempArrangementObj?.number_of_seating_item || '', [Validators.required]],
      vertical_location: [tempArrangementObj?.vertical_location || this.constants.verticalLocationsArr[this.constants.verticalLocationsObj.NONE].value, [Validators.required]],
      horizontal_location: [tempArrangementObj?.horizontal_location || this.constants.horizontalLocationsArr[this.constants.horizontalLocationsObj.NONE].value, [Validators.required]],

      seat_type: [tempArrangementObj?.seat_type || this.constants.seatArr[this.constants.seatObj.NONE].value, [Validators.required]],

      per_seating_person: [tempArrangementObj?.per_seating_person || ''],
      total_person: [tempArrangementObj?.total_person || '', [Validators.required]],

      per_seating_price: [{value: (tempArrangementObj.event_financial_type && tempArrangementObj.event_financial_type == 'free') ? 0 : (tempArrangementObj?.per_seating_price || ''), disabled: !(!tempArrangementObj.event_financial_type || tempArrangementObj.event_financial_type == 'paid')}],
      
      per_person_price: [{value: (tempArrangementObj.event_financial_type && tempArrangementObj.event_financial_type == 'free') ? 0 : (tempArrangementObj?.per_person_price || ''), disabled: !(!tempArrangementObj.event_financial_type || tempArrangementObj.event_financial_type == 'paid')}, [Validators.required]],

      total_amount: [tempArrangementObj?.total_amount || '', [Validators.required]],

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
      if (!this.arrangements?.value?.length) {
        this.addArrangements();
      }
    }
  }

  validateTextEditor(): void {
    if (this.textEditorLimitFood && this.textEditorMaxLimit && this.textEditorLimitFood > this.textEditorMaxLimit) {
      return;
    }
    this.selectedTab = 2;
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
      // console.log(arrangement);
      if (arrangement.number_of_seating_item && arrangement.per_seating_person) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item * arrangement.per_seating_person));
        this.arrangements.controls[index].get('per_person_price')?.setValue(Number((arrangement.per_seating_price / arrangement.per_seating_person).toFixed(2)));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.per_seating_price * arrangement.number_of_seating_item));
      } else if (this.selectedSeatingObj && (this.selectedSeatingObj.itemname == 'Chair' || this.selectedSeatingObj.itemname == 'chair' || this.selectedSeatingObj.itemname == 'Stand' || this.selectedSeatingObj.itemname == 'stand' || this.selectedSeatingObj.itemname == 'NoSeating' || this.selectedSeatingObj.itemname == 'noseating')) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.number_of_seating_item * arrangement.per_person_price));
        this.arrangements.controls[index].get('booking_acceptance')?.setValue(false);
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
    if (this.selectedSeatingObj && (!this.selectedSeatingObj.isonlyperperson)) {
      Object.keys(this.arrangements.controls).forEach((key) => {
        Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
          if (subKey == 'per_seating_person') {
            this.arrangements.controls[key].get('per_seating_person').setValidators([Validators.required]);
            this.arrangements.controls[key].get('per_seating_person').updateValueAndValidity();
            this.arrangements.controls[key].get('per_seating_price').setValidators([Validators.required]);
            this.arrangements.controls[key].get('per_seating_price').updateValueAndValidity();
          }
        });
      });
    }
  }

  selectItems(): void {
    this._sNotify.clear();
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
    if (this.arrangements.value && this.arrangements.value.length) {
      const tmpLocations: any = [];
      _.each(this.arrangements.value, (arrangement: any) => {
        tmpLocations.push(arrangement.vertical_location + arrangement.horizontal_location);
      });
      const uniqueLocationLength: any = _.uniq(tmpLocations);
      if (uniqueLocationLength && uniqueLocationLength.length != this.arrangements.length) {
        this._sNotify.error('Please select unique combination of vertical and horizontal locations.', 'Oops!');
        return;
      }
    }
    this.editorCharacterSetFood();
    this.editorCharacterSetEquipment();
    this.selectedTab = 1;
  }

  addFormData(): void {
    if (this.textEditorLimitEquipment && this.textEditorMaxLimit && this.textEditorLimitEquipment > this.textEditorMaxLimit) {
      return;
    }
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

  editorCharacterSetFood(): any {
    this.textEditorLimitFood = '0';
    const textfield = this.seatingForm.value.food_description;
    if (textfield && textfield != '') {
      const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
      this.textEditorLimitFood = stringOfCKEditor.length;
      this.textEditorFood = (stringOfCKEditor.length > this.textEditorMaxLimit);
    }
  }

  editorCharacterSetEquipment(): any {
    this.textEditorLimitEquipment = '0';
    const textfield = this.seatingForm.value.equipment_description;
    if (textfield && textfield != '') {
      const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
      this.textEditorLimitEquipment = stringOfCKEditor.length;
      this.textEditorEquipment = (stringOfCKEditor.length > this.textEditorMaxLimit);
    }
  }

  closePopup(arrangementsArr: any = []): void {
    this.addEditArrangement.emit(arrangementsArr);
    this.isAddEventChange.emit(false);
  }

  private _prepareArrangementForm(): void {
    // console.log("edit");
    this.seatingForm = this._formBuilder.group({
      seating_item: [{
        value: (this.editArrangementObj && this.editArrangementObj.seating_item) ?
          ((this.editArrangementObj.seating_item._id) ? this.editArrangementObj.seating_item._id : this.editArrangementObj.seating_item) : null, disabled: (this.editArrangementObj && this.editArrangementObj.seating_item)
      }, [Validators.required]],
      arrangements: this._formBuilder.array([]),
      food_included_in_ticket_price:[(!!(this.editArrangementObj && this.editArrangementObj.equipment)), [Validators.required]],
      food: [this.editArrangementObj?.food || 'VEG', [Validators.required]],
      food_details:[{
        url:"ihoiaff",
        description:"kwadi khdw qwkdKD"
      }],
      food_description: [this.editArrangementObj?.food_description || ''],
      equipment: [(!!(this.editArrangementObj && this.editArrangementObj.equipment)), [Validators.required]],
      equipment_description: [this.editArrangementObj?.equipment_description || null],
    });
    // console.log("nik1");
    if (this.editArrangementObj && this.editArrangementObj.arrangements) {
      // console.log("nik1");
      _.each(this.editArrangementObj.arrangements, (arrangement: any) => {
        // console.log(arrangement);
        this.addArrangements(arrangement);
        // console.log("mohan",arrangement);
      });
    } else {
      this.addArrangements();
    }
  }
}
