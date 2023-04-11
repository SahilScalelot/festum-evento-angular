import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SnotifyService } from "ng-snotify";
import { GlobalFunctions } from "../../../../common/global-functions";
import { CreateStreamService } from "../create-stream.service";
import { CONSTANTS } from "../../../../common/constants";
import * as _ from "lodash";
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  liveStreamId: any = '';
  personalDetailForm: any;
  submit: boolean = false;
  constants: any = CONSTANTS;
  isLoading: boolean = false;

  pincodeValidationObj: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _createStreamService: CreateStreamService,
    private _globalService: GlobalService
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }

  ngOnInit(): void {
    this._preparePersonalDetailForm();
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.getPersonalDetailsById(this.liveStreamId);
    } else {
      this._globalService.loginUser$.subscribe((user: any) => {
        if (user) {
          const personalProfile: any = this._globalFunctions.copyObject(user || {});
          const preparePersonalProfile: any = {
            full_name: personalProfile?.name || '',
            mobile_no: personalProfile?.mobile || '',
            email: personalProfile?.email || '',
            flat_no: personalProfile?.flat_no || '',
            street: personalProfile?.street || '',
            area: personalProfile?.area || '',
            state: personalProfile?.state || '',
            city: personalProfile?.city || '',
            pincode: personalProfile?.pincode || '',
          };
          this.personalDetailForm.patchValue(preparePersonalProfile);
        }
      });
    }
  }

  getPersonalDetailsById(liveStreamId: any = ''): any {
    this.isLoading = true;
    this._createStreamService.getPersonalDetailsById(liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const personalDetailObj: any = result?.Data?.personaldetail || {};
        this._preparePersonalDetailForm(personalDetailObj);
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

  pincodeValidation(pincode: any = ''): any {
    if (pincode && pincode != '') {
      this._globalService.pincodeValidation(pincode).subscribe((result: any) => {
        if (result && result[0] && result[0].Status) {
          const formName = this.personalDetailForm;
          if (result[0].Status == 'Success') {
            this.pincodeValidationObj = result[0].PostOffice[0];
            const companyFormValueObj = formName?.value || {};

            formName.markAsTouched();
            formName?.get('city')?.markAsTouched();
            formName?.get('state')?.markAsTouched();
            formName?.get('pincode')?.markAsTouched();
            formName?.controls['city']?.markAsDirty();
            formName?.controls['state']?.markAsDirty();
            formName?.controls['pincode']?.markAsDirty();

            formName?.controls['city']?.setErrors((this.pincodeValidationObj?.District && companyFormValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (companyFormValueObj?.city).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['state']?.setErrors((this.pincodeValidationObj?.State && companyFormValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (companyFormValueObj?.state).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && companyFormValueObj?.pincode && this.pincodeValidationObj.Pincode != companyFormValueObj?.pincode) ? { 'not_match': true } : null);
            
            formName.get('state').setValue(result[0]?.PostOffice[0]?.State);
            formName.get('city').setValue(result[0]?.PostOffice[0]?.District);
          } else if (result[0].Status == 'Error') {
            formName?.controls['pincode']?.setErrors({ 'pattern': true });
          }
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }

  nextStep(): any {
    if (this.personalDetailForm.invalid) {
      Object.keys(this.personalDetailForm.controls).forEach((key) => {
        this.personalDetailForm.controls[key].touched = true;
        this.personalDetailForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.personalDetailForm.disable();
    this._createStreamService.savePersonalDetails(this.personalDetailForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.personalDetailForm.enable();
        this._router.navigate(['/live-stream/create/terms-and-condition']);
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

  private _preparePersonalDetailForm(companyDetailObj: any = {}): void {
    this.personalDetailForm = this._formBuilder.group({
      livestreamid: [this.liveStreamId || ''],
      full_name: [companyDetailObj?.full_name || '', [Validators.required]],
      mobile_no: [companyDetailObj?.mobile_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_mobile_hidden: [companyDetailObj?.is_mobile_hidden || false],
      alt_mobile_no: [companyDetailObj?.alt_mobile_no || '', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_alt_mobile_hidden: [companyDetailObj?.is_alt_mobile_hidden || false],
      email: [companyDetailObj?.email || '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_email_hidden: [companyDetailObj?.is_email_hidden || false],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      state: [companyDetailObj?.state || '', [Validators.required]],
      city: [companyDetailObj?.city || '', [Validators.required]],
      pincode: [companyDetailObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
    this.pincodeValidation(this.personalDetailForm.value.pincode);
  }

}
