import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-add-edit-event',
  templateUrl: './add-edit-event.component.html',
  styleUrls: ['./add-edit-event.component.scss']
})
export class AddEditEventComponent implements OnInit {
  @Input() popClass: any;
  @Input() eventObj: any;
  @Output() isAddEditEventChange = new EventEmitter<boolean>();
  @ViewChild('newEventNgForm') newEventNgForm: any;
  eventType: any;
  constants: any = CONSTANTS;
  newEventForm: any;
  newEventArr: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      let eventString: any = localStorage.getItem('newEventObj');
      const newEventObj = JSON.parse(eventString);
      if (newEventObj && newEventObj.add_event && newEventObj.add_event.length) {
        this.newEventArr = newEventObj.add_event;
      }
    }

    this.eventType = CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].options;
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
    if (!this.validate()) {
      return;
    }
    const preparedEventForm: any = this.newEventForm.value;
    if (preparedEventForm.other_category && preparedEventForm.other_category != '') {
      preparedEventForm.event_category = preparedEventForm.other_category;
    }
    this.newEventArr.push(preparedEventForm);
    localStorage.setItem('newEventObj', JSON.stringify({add_event: this.newEventArr}));
    this.closePopup();
  }

  closePopup(): void {
    this.isAddEditEventChange.emit(false);
  }

}
