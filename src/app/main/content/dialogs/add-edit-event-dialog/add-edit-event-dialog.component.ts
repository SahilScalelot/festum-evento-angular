import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CONSTANTS } from "../../../common/constants";
import { CreateEventService } from '../../create-event/create-event.service';

@Component({
  selector: 'app-add-edit-event-dialog',
  templateUrl: './add-edit-event-dialog.component.html',
  styleUrls: ['./add-edit-event-dialog.component.scss']
})
export class AddEditEventDialogComponent implements OnInit {
  @Input() popClass: any;
  @Input() eventObj: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() isEditEventChange = new EventEmitter<boolean>();
  @Output() editedEvent = new EventEmitter<boolean>();
  @ViewChild('newEventNgForm') newEventNgForm: any;
  constants: any = CONSTANTS;
  newEventForm: any;
  selectedEventType: string = '';
  eventCategories: any;
  isLoading: boolean = false;
  isForUpdateEvent: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions
  ) {
  }

  ngOnInit(): void {
    this.selectedEventType = this.eventObj?.event_type ? this.eventObj.event_type : CONSTANTS.eventTypeArr[CONSTANTS.eventTypeObj.b2b].value;
    this.getEventCategories();
    this.isForUpdateEvent = !!(this.eventObj && this.eventObj._id);
    this.newEventForm = this._formBuilder.group({
      name: [this.eventObj?.name ? this.eventObj.name : '', [Validators.required]],
      event_type: [this.selectedEventType, Validators.required],
      event_category: [this.eventObj?.event_category ? ((this.eventObj.event_category?._id) ? this.eventObj.event_category._id : '') : ''],
      other: [this.eventObj?.other ? this.eventObj.other : ''],
    });    
  }

  getEventCategories(): void {
    this.isLoading = true;
    const eventTypeObj: any = {event_type: this.selectedEventType};
    this._createEventService.getEventCategories(eventTypeObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.eventCategories = result.Data;
        this.isLoading = false;
      }
    }, (error: any) => {
      // this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onChangeEventType(eventType: any): void {
    this.selectedEventType = eventType;
    if (this.eventObj && this.eventObj.event_category && this.eventObj.event_category.event_type != eventType) {
      this.newEventForm.get('event_category').setValue('');
    }
    this.getEventCategories();
  }

  validate(preparedEventObj: any): boolean {
    if (!preparedEventObj.name || preparedEventObj.name === "") {
      this._sNotify.error('Event Name is required!', 'Oops!');
      return false;
    }
    if (!preparedEventObj.event_type || preparedEventObj.event_type === "") {
      this._sNotify.error('Event Type is required!', 'Oops!');
      return false;
    }
    if ((!preparedEventObj.event_category || preparedEventObj.event_category === "") && (!preparedEventObj.other || preparedEventObj.other === "")) {
      this._sNotify.error('Event Category is required!', 'Oops!');
      return false;
    }
    return true;
  }

  addEvent(): any {
    const preparedEventObj: any = this.prepareEventObj(this.newEventForm.value);
    if (!this.validate(preparedEventObj)) {
      return;
    }
    this.isLoading = true;
    this.newEventForm.disable();
    this._createEventService.addEvent(preparedEventObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        localStorage.setItem('eId', result.Data._id);
        this.isLoading = false;
        this.newEventForm.enable();
        this.closePopup();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.newEventForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.newEventForm.enable();
    });
  }

  updateEvent(): any {
    const preparedEventObj: any = this.prepareEventObj(this.newEventForm.value, true);
    if (!this.validate(preparedEventObj)) {
      return;
    }
    this.isLoading = true;
    this.newEventForm.disable();
    this._createEventService.addEvent(preparedEventObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.newEventForm.enable();
        this.editedEvent.emit(result.Data);
        this.closePopup();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.newEventForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.newEventForm.enable();
    });
  }

  prepareEventObj(eventObj: any = {}, isForUpdateEvent: boolean = false): any {
    const preparedEventObj: any = this._globalFunctions.copyObject(eventObj);
    if (isForUpdateEvent) {
      preparedEventObj.eventid = this.eventObj._id || '';
    }
    return preparedEventObj;
  }

  closePopup(): void {
    if (localStorage.getItem('eId')) {
      this.isEditEventChange.emit(false);
      this.isAddEventChange.emit(false);
    } else {
      this.isAddEventChange.emit(false);
    }
  }

}
