import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { SnotifyService } from "ng-snotify";
import { GlobalFunctions } from "../../../../common/global-functions";
import { CreateStreamService } from "../create-stream.service";
import {CONSTANTS} from "../../../../common/constants";

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

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _createStreamService: CreateStreamService,
  ) { }

  ngOnInit(): void {
    this._preparePersonalDetailForm();
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.getPersonalDetailsById(this.liveStreamId);
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
      email: [companyDetailObj?.email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_email_hidden: [companyDetailObj?.is_email_hidden || false],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      state: [companyDetailObj?.state || '', [Validators.required]],
      city: [companyDetailObj?.city || '', [Validators.required]],
      pincode: [companyDetailObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
  }

}
