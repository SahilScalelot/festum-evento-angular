import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { CreateStreamService } from '../create-stream.service';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as _ from 'lodash';
import {CONSTANTS} from "../../../../common/constants";
declare let $: any;

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  termsAndConditionsForm: any;
  isLoading: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  agreeTAndC: boolean = false;
  liveStreamId: any;

  termsAndConditionsObj: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _createStreamService: CreateStreamService,
  ) { }

  ngOnInit(): void {
    this.liveStreamId = localStorage.getItem('lsId');
    this.getTAndCEvent();
    this.editorConfig = CONSTANTS.editorConfig;
    this._prepareTAndCForm(this.termsAndConditionsObj);
    this.termsAndConditionsForm.get('status').setValue(false);
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  tAndCPop(): void {
    if (this.termsAndConditionsForm.value && this.termsAndConditionsForm.value.status == false) {
      this.termsAndConditionsForm.get('status').setValue(false);
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.termsAndConditionsForm.get('status').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.termsAndConditionsForm.get('status').setValue(true);
    this._modalService.close("tandc");
  }

  backBtn(): void {
    this._router.navigate(['/live-stream/create/personal-details']);
  }

  getTAndCEvent(): any {
    this.isLoading = true;
    this._createStreamService.getTAndCById(this.liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.tandc || {};
        this._prepareTAndCForm(eventLocationObj);
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

  saveFullEvent(): void {
    if (this.termsAndConditionsForm.invalid) {
      Object.keys(this.termsAndConditionsForm.controls).forEach((key) => {
        this.termsAndConditionsForm.controls[key].touched = true;
        this.termsAndConditionsForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isLoading = true;
    this.termsAndConditionsForm.disable();
    const preparedLocationObj: any = this.prepareTAndCEventObj(this.termsAndConditionsForm.value);
    this._createStreamService.saveLiveStreamTAndC(preparedLocationObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.termsAndConditionsForm.enable();
        this._router.navigate(['/live-stream']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.termsAndConditionsForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.termsAndConditionsForm.enable();
    });
  }

  prepareTAndCEventObj(locationObj: any = {}): any {
    const preparedLocationEventObj: any = locationObj;
    preparedLocationEventObj.livestreamid = this.liveStreamId;
    return preparedLocationEventObj;
  }

  private _prepareTAndCForm(eventObj: any = {}): void {
    this.termsAndConditionsForm = this._formBuilder.group({
      t_and_c: [eventObj?.t_and_c, [Validators.required]],
      facebook: [eventObj?.facebook],
      youtube: [eventObj?.youtube],
      twitter: [eventObj?.twitter],
      pinterest: [eventObj?.pinterest],
      instagram: [eventObj?.instagram],
      linkedin: [eventObj?.linkedin],
      status: [eventObj?.status, { disabled: true }],
    });
  }
}
