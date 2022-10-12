import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  @ViewChild('newEventNgForm') newEventNgForm: any;
  eventType: any;
  constants: any = CONSTANTS;
  newEventForm: any;
  newEventObj: any = {};
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      let eventString: any = localStorage.getItem('newEventObj');
      const newEventObj = JSON.parse(eventString);
      if (newEventObj && newEventObj.add_event) {
        this.newEventObj = newEventObj;
      }
    }

    this.eventObj = this.newEventObj.add_event;
    const eventType: any = (this.eventObj && this.eventObj.event_type) ? this.eventObj.event_type : CONSTANTS.eventType.B2B
    this.eventType = CONSTANTS.unitTypeArr[eventType].options;
    this.newEventForm = this._formBuilder.group({
      name: [this.eventObj?.name ? this.eventObj.name : '', [Validators.required]],
      event_type: [this.eventObj?.event_type ? this.eventObj.event_type : CONSTANTS.eventType.B2B, Validators.required],
      event_category: [this.eventObj?.event_category ? this.eventObj.event_category : '', Validators.required],
      other_category: [this.eventObj?.other_category ? this.eventObj.other_category : ''],
    });
  }

  validate(): boolean {
    if (!this.newEventForm.value.name || this.newEventForm.value.name === "") {
      this._sNotify.error('Event Name is required!', 'Oops!');
      return false;
    }
    if (!this.newEventForm.value.event_type || this.newEventForm.value.event_type === "") {
      this._sNotify.error('Event Type is required!', 'Oops!');
      return false;
    }
    if (!this.newEventForm.value.event_category || this.newEventForm.value.event_category === "") {
      this._sNotify.error('Event Category is required!', 'Oops!');
      return false;
    }
    return true;
  }

  addEvent(): any {
    this.isLoading = true;
    const preparedEventObj: any = this.newEventForm.value;
    preparedEventObj.is_other = false;
    if (preparedEventObj.other_category && preparedEventObj.other_category != '') {
      preparedEventObj.event_category = preparedEventObj.other_category;
      preparedEventObj.is_other = true;
    }
    if (!this.validate()) {
      return;
    }

    this._createEventService.addEvent(preparedEventObj).subscribe((result: any) => {
      if (result && result.status) {
        this.newEventObj.add_event = result.detail;
        localStorage.setItem('newEventObj', JSON.stringify(this.newEventObj));
        this.isLoading = false;
        this.closePopup();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  closePopup(): void {
    if (localStorage.getItem('newEventObj')) {
      this.isEditEventChange.emit(false);
      this.isAddEventChange.emit(false);
    } else {
      this.isAddEventChange.emit(false);
    }
  }

}
