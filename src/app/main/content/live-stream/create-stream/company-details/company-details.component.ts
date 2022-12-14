import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalFunctions } from "../../../../common/global-functions";
import { CreateStreamService } from "../create-stream.service";
import { CONSTANTS } from "../../../../common/constants";
import { SnotifyService } from "ng-snotify";
import { Router } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  liveStreamId: any = '';
  companyForm: any;
  gstPdf: any;
  inputText: any;
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isInvalidPDF: boolean = false;
  isPdfLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _createStreamService: CreateStreamService,
  ) { }

  ngOnInit(): void {
    this._prepareCompanyDetailForm();
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.getCompanyDetailsById(this.liveStreamId);
    }
  }

  getCompanyDetailsById(liveStreamId: any = ''): void {
    this.isLoading = true;
    this._createStreamService.getCompanyDetailsById(liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const companyDetailObj: any = result?.Data?.companydetail || {};
        this._prepareCompanyDetailForm(companyDetailObj || {});
        if (companyDetailObj.gst && companyDetailObj.gst != '') {
          this.gstPdf = companyDetailObj.gst;
          this.inputText = _.last(_.split(companyDetailObj.gst, '/'));
        }
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

  onChangePDF(event: any): any {
    if (event.target.files && event.target.files[0]) {
      const pdfUpload = event.target.files[0];
      const pdfFormData = new FormData();
      this.isInvalidPDF = false;
      if (pdfUpload != undefined) {
        if (pdfUpload.type != 'application/pdf') {
          // this._sNotify.error('File type is Invalid.', 'Oops!');
          this.isInvalidPDF = true;
          return false;
        }
        pdfFormData.append('file', pdfUpload);
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
  }

  nextStep(): any {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.companyForm.disable();
    const companyDetailsObj: any = this._globalFunctions.copyObject(this.companyForm.value);
    companyDetailsObj.gst = this.gstPdf;
    this._createStreamService.saveCompanyDetails(companyDetailsObj).subscribe((result: any) => {
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

  private _prepareCompanyDetailForm(companyDetailObj: any = {}): void {
    this.companyForm = this._formBuilder.group({
      livestreamid: [this.liveStreamId || ''],
      name: [companyDetailObj?.name || '', [Validators.required]],
      gst: [this.gstPdf || ''],
      contact_no: [companyDetailObj?.contact_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [companyDetailObj?.email || '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      city: [companyDetailObj?.city || '', [Validators.required]],
      state: [companyDetailObj?.state || '', [Validators.required]],
      pincode: [companyDetailObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
    this.inputText = companyDetailObj?.company_details?.company_detail?.gst_name;
  }

}
