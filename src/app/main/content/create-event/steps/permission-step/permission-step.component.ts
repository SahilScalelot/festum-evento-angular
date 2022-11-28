import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CONSTANTS} from "../../../../common/constants";
import {FormBuilder, Validators} from "@angular/forms";
import {SnotifyService} from "ng-snotify";
import {Router} from "@angular/router";
import { CreateEventService } from '../../create-event.service';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-permission-step',
  templateUrl: './permission-step.component.html',
  styleUrls: ['./permission-step.component.scss']
})
export class PermissionStepComponent implements OnInit {
  permissionForm: any;
  inputText: any;
  constants: any = CONSTANTS;  
  isInValidPDF: boolean = false;
  isPdfLoading: boolean = false;  
  isLoading: boolean = false;  

  permissionObj: any;
  permissionPdf: any;
  eventId: any;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _createEventService: CreateEventService,
  ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this.getCompanyDetailsEvent();    
    this._preparePermissionForm(this.eventObj);
  }

  private _preparePermissionForm(eventObj: any = {}): void {
    this.permissionForm = this._formBuilder.group({
      permission_letter: [null],
      accept_booking: [eventObj?.accept_booking || false]
    });
    this.inputText = eventObj?.company_details?.company_detail?.gst_name;
  }

  getCompanyDetailsEvent(): any {
    this.isLoading = true;
    this._createEventService.getPermission(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventPermissionObj: any = result?.Data || {};
        this.permissionObj = eventPermissionObj;
        this._preparePermissionForm(eventPermissionObj);
        this.permissionPdf = eventPermissionObj.permission_letter;
        this.inputText = _.last(_.split(eventPermissionObj.permission_letter, '/'));
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
    const pdfUpload = $('#permission_letter')[0].files[0];
    const pdfFormData = new FormData();
    this.isInValidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload != undefined && pdfUpload.type != 'application/pdf') {
        // this._sNotify.error('File type is Invalid.', 'Oops!');
        $('#permission_letter').focus();
        this.isInValidPDF = true;
        return false;
      }      
      pdfFormData.append('file', pdfUpload);
      this.isPdfLoading = true;
      this._createEventService.documentUpload(pdfFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.permissionPdf = result.Data.url;
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
  submitPermissionForm(): void {
    this.permissionForm.get('permission_letter').setErrors({'required': false});
    if (((!this.permissionObj || !this.permissionObj.permission_letter) && (!this.permissionForm.value || !this.permissionForm.value.permission_letter)) ||
      (this.permissionObj && (!this.permissionObj.permission_letter || this.permissionObj.permission_letter == ''))) {
      // this.permissionForm.controls.markAsDirty();
      Object.keys(this.permissionForm.controls).forEach((key) => {
        this.permissionForm.controls[key].touched = true;
        this.permissionForm.controls[key].markAsDirty();
      });
      this.permissionForm.get('permission_letter').setErrors({'required': true});
      return;
    }  
    this.isLoading = true;
    this.permissionForm.disable();
    const preparedCompanyDetailsObj: any = this.preparePermissionObj(this.permissionForm.value);    
    this._createEventService.permission(preparedCompanyDetailsObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.permissionForm.enable();
        this._router.navigate(['/events/create/discount']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.permissionForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.permissionForm.enable();
    });
  }

  
  preparePermissionObj(permissionObj: any = {}): any {
    const preparedObj: any = permissionObj;
    preparedObj.eventid = this.eventId;
    preparedObj.permission_letter = this.permissionPdf;
    return preparedObj;
  }

}
