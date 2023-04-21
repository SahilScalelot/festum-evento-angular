import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from 'src/app/services/global.service';
import { CreateStreamService } from '../create-stream.service';
import * as _ from 'lodash';
import { ModalService } from 'src/app/main/_modal';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { forkJoin, Observable, switchMap } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})

export class CompanyDetailsComponent implements OnInit {
  imgChangeEvt: any = '';
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isPdfLoading: boolean = false;
  isImgLoading: boolean = false;
  isVideoLoading: boolean = false;
  isDeleteLoading: boolean = false;
  deleteItemObj: any = {};

  companyForm: any;
  inputText: any;

  companyDetailObj: any = {};
  pdfObj: any = [];

  liveStreamId: any;
  gstPdf: any;

  isInValidPDF: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  pincodeValidationObj: any = '';

  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimit: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _createStreamService: CreateStreamService,
    private _globalService: GlobalService,
    private _modalService: ModalService,
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }

  ngOnInit(): void {
    if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
      this._router.navigate(['/events']);
    }
    this.liveStreamId = localStorage.getItem('lsId');
    this.getCompanyDetailsEvent();
    this._prepareCompanyDetailsForm();
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  private _prepareCompanyDetailsForm(companyDetailObj: any = {}): void {
    this.companyForm = this._formBuilder.group({
      name: [companyDetailObj?.name || '', [Validators.minLength(2)]],
      gst: [this.gstPdf || ''],
      contact_no: [companyDetailObj?.contact_no || '', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [companyDetailObj?.email || '', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      city: [companyDetailObj?.city || ''],
      state: [companyDetailObj?.state || ''],
      pincode: [companyDetailObj?.pincode || '', [Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });

    this.inputText = companyDetailObj?.company_details?.company_detail?.gst_name;
    this.pincodeValidation(this.companyForm.value.pincode);
  }

  getCompanyDetailsEvent(): any {
    this.isLoading = true;
    this._createStreamService.getCompanyDetailsById(this.liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const companyDetailObj: any = result?.Data?.companydetail || {};
        if (companyDetailObj && companyDetailObj.pincode && companyDetailObj.pincode != '') {
          this._prepareCompanyDetailsForm(companyDetailObj);
        } else {
          this.getDataFromProfileObj();
        }
        this.gstPdf = companyDetailObj.gst;
        this.inputText = _.last(_.split(companyDetailObj.gst, '/'));
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
          if (result[0].Status == 'Success') {
            this.pincodeValidationObj = result[0].PostOffice[0];
            const companyFormValueObj = this.companyForm?.value || {};

            this.companyForm.markAsTouched();
            this.companyForm?.get('city')?.markAsTouched();
            this.companyForm?.get('state')?.markAsTouched();
            this.companyForm?.get('pincode')?.markAsTouched();
            this.companyForm?.controls['city']?.markAsDirty();
            this.companyForm?.controls['state']?.markAsDirty();
            this.companyForm?.controls['pincode']?.markAsDirty();

            this.companyForm?.controls['city']?.setErrors((this.pincodeValidationObj?.District && companyFormValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (companyFormValueObj?.city).toLowerCase()) ? { 'not_match': true } : null);
            this.companyForm?.controls['state']?.setErrors((this.pincodeValidationObj?.State && companyFormValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (companyFormValueObj?.state).toLowerCase()) ? { 'not_match': true } : null);
            this.companyForm?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && companyFormValueObj?.pincode && this.pincodeValidationObj.Pincode != companyFormValueObj?.pincode) ? { 'not_match': true } : null);

            this.companyForm.get('state').setValue(result[0]?.PostOffice[0]?.State);
            this.companyForm.get('city').setValue(result[0]?.PostOffice[0]?.District);
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            this.companyForm?.controls['pincode']?.setErrors({ 'pattern': true });
            this.isLoading = false;
          }
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
    this.isLoading = false;
  }

  getDataFromProfileObj(): void {
    this.isLoading = true;
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        const businessProfile: any = this._globalFunctions.copyObject(user?.businessProfile || {});
        businessProfile.contact_no = businessProfile.mobile;
        this._prepareCompanyDetailsForm(businessProfile);
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  onChangePDF(event: any): any {
    const pdfUpload = $('#company_gst')[0].files[0];
    const pdfFormData = new FormData();
    this.isInValidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload != undefined && pdfUpload.type != 'application/pdf') {
        // this._sNotify.error('File type is Invalid.', 'Oops!');
        $('#company_gst').focus();
        this.isInValidPDF = true;
        return false;
      }
      pdfFormData.append('file', pdfUpload);
      // this.inputText = event?.target?.files[0]?.name;
      // this.companyForm.get('gst').setValue(this.inputText);
      this.isPdfLoading = true;
      this._createStreamService.uploadDocument(pdfFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.gstPdf = result.Data.url;
          this.inputText = _.last(_.split(result.Data.url, '/'));
          this._sNotify.success('File Uploaded Successfully.', 'Success');
          this.isPdfLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isPdfLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isPdfLoading = false;
      });
    }
  }

  close(): void {
    this.deleteItemObj = {};
    this._modalService.close("delete-event-pop");
  }

  nextStep(): void {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.companyForm.disable();
    const preparedCompanyDetailsObj: any = this.prepareObj(this.companyForm.value);
    this._createStreamService.saveCompanyDetails(preparedCompanyDetailsObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.companyForm.enable();
        this._router.navigate(['/live-stream/create/personal-details']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.companyForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.companyForm.enable();
    });
  }

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    preparedObj.livestreamid = this.liveStreamId;
    preparedObj.gst = this.gstPdf;
    return preparedObj;
  }
}