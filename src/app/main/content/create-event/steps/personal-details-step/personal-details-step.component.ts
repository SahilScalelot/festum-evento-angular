import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from '../../create-event.service';

@Component({
  selector: 'app-personal-details-step',
  templateUrl: './personal-details-step.component.html',
  styleUrls: ['./personal-details-step.component.scss'],
})
export class PersonalDetailsStepComponent implements OnInit {
  personalDetailForm: any;
  submit: boolean = false;
  isLoading: boolean = false;
  
  eventId: any;
  personalDetailsObj: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this.getPersonalDetailsEvent();
    this._preparePersonalDetailsEventForm(this.personalDetailsObj);
  }

  private _preparePersonalDetailsEventForm(personalDetailsObj: any = {}): void {
    this.personalDetailForm = this._formBuilder.group({
      full_name: [personalDetailsObj?.full_name || '', [Validators.required]],
      mobile_no: [personalDetailsObj?.mobile_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_mobile_hidden: [personalDetailsObj?.is_mobile_hidden || false],
      alt_mobile_no: [personalDetailsObj?.alt_mobile_no || '', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_alt_mobile_hidden: [personalDetailsObj?.is_alt_mobile_hidden || false],
      email: [personalDetailsObj?.email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_email_hidden: [personalDetailsObj?.is_email_hidden || false],
      flat_no: [personalDetailsObj?.flat_no || ''],
      street: [personalDetailsObj?.street || ''],
      area: [personalDetailsObj?.area || ''],
      state: [personalDetailsObj?.state || '', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
      city: [personalDetailsObj?.city || '', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
      pincode: [personalDetailsObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
  }

  getPersonalDetailsEvent(): any {
    this.isLoading = true;
    this._createEventService.getPersonalDetail(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.personaldetail || {};
        this._preparePersonalDetailsEventForm(eventLocationObj);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  personalDetail(): any {
    if (this.personalDetailForm.invalid) {
      Object.keys(this.personalDetailForm.controls).forEach((key) => {
        this.personalDetailForm.controls[key].touched = true;
        this.personalDetailForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.personalDetailForm.disable();
    const preparedLocationObj: any = this.preparePersonalDetailObj(this.personalDetailForm.value);
    this._createEventService.personalDetail(preparedLocationObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.personalDetailForm.enable();
        this._router.navigate(['events/create/terms-and-conditions']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.personalDetailForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.personalDetailForm.enable();
    });
  }

  preparePersonalDetailObj(personalObj: any = {}): any {
    const preparedObj: any = personalObj;
    preparedObj.eventid = this.eventId;
    return preparedObj;
  }
}