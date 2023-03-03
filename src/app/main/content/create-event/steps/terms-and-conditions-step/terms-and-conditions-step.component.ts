import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from '../../create-event.service';
import * as _ from 'lodash';
import {CONSTANTS} from "../../../../common/constants";
declare let $: any;

@Component({
  selector: 'app-terms-and-conditions-step',
  templateUrl: './terms-and-conditions-step.component.html',
  styleUrls: ['./terms-and-conditions-step.component.scss']
})
export class TermsAndConditionsStepComponent implements OnInit {
  constants: any = CONSTANTS;
  termsAndConditionsForm: any;
  isLoading: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  agreeTAndC: boolean = false;
  eventId: any;

  termsAndConditionsObj: any = {};

  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit3;
  textEditorLimit: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _router: Router,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
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
    this._router.navigate(['/events/create/personal-details']);
  }

  getTAndCEvent(): any {
    this.isLoading = true;
    this._createEventService.getTAndC(this.eventId).subscribe((result: any) => {
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
  
  editorCharacterSet(): any {
    const textfield = this.termsAndConditionsForm?.get('t_and_c')?.value;
    const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
    this.textEditorLimit = stringOfCKEditor.length;
    this.textEditor = (stringOfCKEditor.length > this.textEditorMaxLimit);
  }

  saveFullEvent(): void {
    if (this.termsAndConditionsForm.invalid) {
      Object.keys(this.termsAndConditionsForm.controls).forEach((key) => {
        this.termsAndConditionsForm.controls[key].touched = true;
        this.termsAndConditionsForm.controls[key].markAsDirty();
      });      
      return;
    }
    this.editorCharacterSet();
    if (this.textEditorLimit && this.textEditorMaxLimit && this.textEditorLimit > this.textEditorMaxLimit) {
      return;
    }
    if (this.termsAndConditionsForm.value.status != '') {
      this.isLoading = true;
      this.termsAndConditionsForm.disable();
      const preparedLocationObj: any = this.prepareTAndCEventObj(this.termsAndConditionsForm.value);
      this._createEventService.tAndC(preparedLocationObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.isLoading = false;
          this.termsAndConditionsForm.enable();
          this._router.navigate(['/events']);
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
  }

  prepareTAndCEventObj(locationObj: any = {}): any {
    const preparedLocationEventObj: any = locationObj;
    preparedLocationEventObj.eventid = this.eventId;
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
      status: [false, [Validators.requiredTrue]],
    });

    if (eventObj?.t_and_c) {
      this.editorCharacterSet();
    }    
  }

}
