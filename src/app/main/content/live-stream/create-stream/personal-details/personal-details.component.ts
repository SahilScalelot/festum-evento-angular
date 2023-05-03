import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from 'src/app/services/global.service';
import { CreateStreamService } from '../create-stream.service';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as _ from 'lodash';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  PhoneNumberFormat = PhoneNumberFormat;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
    alt_phone: new FormControl(undefined),

    is_mobile_hidden: new FormControl(true),
    is_alt_mobile_hidden: new FormControl(true),
  });;
  @ViewChild('phoneF') form: any;

  personalDetailForm: any;
  submit: boolean = false;
  isLoading: boolean = false;
  constants: any = CONSTANTS;
  
  liveStreamId: any;
  personalDetailsObj: any = {};
  pincodeValidationObj: any = '';
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimit: any = this.textEditorMaxLimit;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
    private _createStreamService: CreateStreamService,
    private _globalFunctions: GlobalFunctions,
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }

  ngOnInit(): void {
    if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
      this._router.navigate(['/live-stream']);
    }
    this.liveStreamId = localStorage.getItem('lsId');
    this.getPersonalDetailsEvent();
    this._preparePersonalDetailsEventForm(this.personalDetailsObj);
  }

  private _preparePersonalDetailsEventForm(personalDetailsObj: any = {}): void {
    this.personalDetailForm = this._formBuilder.group({
      full_name: [personalDetailsObj?.full_name || '', [Validators.required]],
      mobile_no: [personalDetailsObj?.mobile_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_mobile_hidden: [personalDetailsObj?.is_mobile_hidden || true],
      alt_mobile_no: [personalDetailsObj?.alt_mobile_no || '', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      is_alt_mobile_hidden: [personalDetailsObj?.is_alt_mobile_hidden || true],
      email: [personalDetailsObj?.email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_email_hidden: [personalDetailsObj?.is_email_hidden || true],
      flat_no: [personalDetailsObj?.flat_no || ''],
      street: [personalDetailsObj?.street || ''],
      area: [personalDetailsObj?.area || ''],
      state: [personalDetailsObj?.state || '', [Validators.required]],
      city: [personalDetailsObj?.city || '', [Validators.required]],
      pincode: [personalDetailsObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
    this.pincodeValidation(this.personalDetailForm.value.pincode);
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getPersonalDetailsEvent(): any {
    this.isLoading = true;
    this._createStreamService.getPersonalDetailsById(this.liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.personaldetail || {};
        if (eventLocationObj && eventLocationObj.pincode && eventLocationObj.pincode != '') {
          this._preparePersonalDetailsEventForm(eventLocationObj);
        } else {
          this.getDataFromProfileObj();
        }
        this.phoneForm.patchValue({
          phone: eventLocationObj.country_wise_contact || undefined,
          alt_phone: eventLocationObj.alt_country_wise_contact || undefined,
          is_mobile_hidden: eventLocationObj.is_mobile_hidden || true,
          is_alt_mobile_hidden: eventLocationObj.is_alt_mobile_hidden || true,
        });
        this.editorCharacterSet();
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
      this.isLoading = true;
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
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            formName?.controls['pincode']?.setErrors({ 'pattern': true });
            this.isLoading = false;
          }
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }

  getDataFromProfileObj(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        const personalProfile: any = this._globalFunctions.copyObject(user || {});
        personalProfile.full_name = personalProfile.name;
        personalProfile.mobile_no = personalProfile.mobile;
        this._preparePersonalDetailsEventForm(personalProfile);
      }
    });
  }
  
  editorCharacterSet(): any {
    this.textEditorLimit = '0';
    const textfield = this.personalDetailForm.value.about;    
    if (textfield && textfield != '') {
      const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
      this.textEditorLimit = stringOfCKEditor.length;
      this.textEditor = (stringOfCKEditor.length > this.textEditorMaxLimit);
    }
  }

  personalDetail(): any {
    if (this.personalDetailForm.invalid) {
      Object.keys(this.personalDetailForm.controls).forEach((key) => {
        this.personalDetailForm.controls[key].touched = true;
        this.personalDetailForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.phoneForm.invalid) {
      this.form.form.controls['phone'].touched = true;
      this.phoneForm.controls['phone'].markAsDirty();
      // Object.keys(this.phoneForm.controls).forEach((key) => {
      //   this.phoneForm.controls[key].touched = true;
      //   this.phoneForm.controls[key].markAsDirty();
      // });
      return;
    }
    this.editorCharacterSet();
    if (this.textEditorLimit && this.textEditorMaxLimit && this.textEditorLimit > this.textEditorMaxLimit) {
      return;
    }
    this.isLoading = true;
    this.personalDetailForm.disable();
    const preparedLocationObj: any = this.preparePersonalDetailObj(this.personalDetailForm.value);
    this._createStreamService.savePersonalDetails(preparedLocationObj).subscribe((result: any) => {
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

  preparePersonalDetailObj(personalObj: any = {}): any {
    const preparedObj: any = personalObj;
    preparedObj.livestreamid = this.liveStreamId;

    preparedObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedObj.dial_code = preparedObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedObj.country_wise_contact?.e164Number || '';
    preparedObj.mobile_no = (contactNumber && contactNumber != '') ? contactNumber.replace(preparedObj.dial_code, '') : '';
    preparedObj.is_mobile_hidden = this.phoneForm?.value?.is_mobile_hidden || true;
    
    preparedObj.alt_country_wise_contact = this.phoneForm?.value?.alt_phone || undefined;
    preparedObj.alt_dial_code = preparedObj.alt_country_wise_contact?.dialCode || '';
    const alt_contactNumber = preparedObj.alt_country_wise_contact?.e164Number || '';
    preparedObj.alt_mobile_no = (alt_contactNumber && alt_contactNumber != '') ? alt_contactNumber.replace(preparedObj.alt_dial_code, '') : '';
    preparedObj.is_alt_mobile_hidden = this.phoneForm?.value?.is_alt_mobile_hidden || true;
    return preparedObj;
  }
}