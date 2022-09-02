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
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() isEditEventChange = new EventEmitter<boolean>();
  @ViewChild('newEventNgForm') newEventNgForm: any;
  eventType: any;
  constants: any = CONSTANTS;
  newEventForm: any;
  newEventObj: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.newEventObj = JSON.parse(eventString);
      console.log(this.newEventObj);
    }

    this.eventType = CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].options;
    this.newEventForm = this._formBuilder.group({
      name: [this.eventObj?.name ? this.eventObj.name : '', [Validators.required]],
      event_type: [this.eventObj?.event_type ? this.eventObj.event_type : 'b2b', Validators.required],
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
    localStorage.setItem('newEventObj', JSON.stringify({add_event: preparedEventForm}));
    this.closePopup();

    // this.newEventForm.disable();
    // this._authService.register(this.newEventForm.value).subscribe((result: any) => {
    //   if (result.flag) {
    //     this._sNotify.success(result.message, 'Success');
    //     this._router.navigate(['login']);
    //   } else {
    //     this._sNotify.success(result.message, 'error');
    //     this.newEventForm.enable();
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //   }
    // }, (error: any) => {
    //   this.newEventForm.enable();
    //   // this.registerNgForm.resetForm();
    //   this._globalFunctions.errorHanding(error, this, true);
    //   // this._sNotify.success(result.message, 'error');
    // });
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
    this.isEditEventChange.emit(false);
  }

}
