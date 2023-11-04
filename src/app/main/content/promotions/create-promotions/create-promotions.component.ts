import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {PromotionsService} from "../promotions.service";
import * as _ from "lodash";
import {GlobalFunctions} from "../../../common/global-functions";
import {CONSTANTS} from "../../../common/constants";
import {ModalService} from "../../../_modal";

@Component({
  selector: 'app-create-promotions',
  templateUrl: './create-promotions.component.html',
  styleUrls: ['./create-promotions.component.scss']
})
export class CreatePromotionsComponent implements OnInit {
  notificationForm: any;
  notificationId: any = '';
  editorConfig: any = {};
  minDateValue: any = new Date();
  constants: any = CONSTANTS;
  detailEditor = DecoupledEditor;
  inputText: any;
  isLoading: boolean = false;
  isPhotoLoading: boolean = false;
  isCreateNotificationLoading: boolean = false;

  get image(): any {
    return this.notificationForm?.get('banner');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _promotionsService: PromotionsService,
    private _modalService: ModalService,
    private _sNotify: SnotifyService,
  ) { }

  ngOnInit(): void {
    this.editorConfig = CONSTANTS.editorConfig;
    this._prepareNotificationForm();
    if (localStorage.getItem('nId') && localStorage.getItem('nId') != '') {
      this.notificationId = localStorage.getItem('nId');
      this.getNotificationById(this.notificationId);
    }
    this.notificationForm.get('is_notification').valueChanges.subscribe((change: any) => {
      console.log(change)
    });
  }

  onTextEditorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getNotificationById(notificationId: any): void {
    this.isLoading = true;
    this._promotionsService.getNotificationById(notificationId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const notificationObj: any = result?.Data || {};
        this._prepareNotificationForm(notificationObj || {});
        if (notificationObj.banner) {
          this.inputText = _.last(_.split(notificationObj.banner, '/'));
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

  updateNotification() {
    const bannerControl = this.notificationForm.get('banner');
    const descriptionControl = this.notificationForm.get('description');

    if (this.notificationForm.get('is_notification').value) {
      bannerControl.setValidators(Validators.required);
      descriptionControl.setValidators(Validators.required);
    } else {
      bannerControl.clearValidators();
      descriptionControl.clearValidators();
    }

    bannerControl.updateValueAndValidity();
    descriptionControl.updateValueAndValidity();
  }

  updateEmail() {
    const emailTemplateControl = this.notificationForm.get('email_template_id');
    if (this.notificationForm.get('is_email').value) {
      emailTemplateControl.setValidators(Validators.required);
    } else {
      emailTemplateControl.clearValidators();
    }
    emailTemplateControl.updateValueAndValidity();
  }

  onChangePhoto(event: any): any {
    if (!event || !event.target || !event.target.files || !event.target.files.length) {
      return false;
    }
    const image = event.target.files[0];
    if (image != undefined) {
      if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png') {
        this._sNotify.error('Image type is Invalid.', 'Oops!');
        return false;
      }
      const image_size = image.size / 1024 / 1024;
      if (image_size > CONSTANTS.maxPosterSizeInMB) {
        this._sNotify.error('Maximum Photo Size is ' + CONSTANTS.maxPosterSizeInMB + 'MB.', 'Oops!');
        return false;
      }

      const imageFormData = new FormData();
      imageFormData.append('file', image);
      this.isPhotoLoading = true;
      this._promotionsService.uploadBanner(imageFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.image.setValue(result.Data.url);
          this.inputText = _.last(_.split(result.Data.url, '/'));
          this._sNotify.success('Photo Uploaded Successfully.', 'Success');
          this.isPhotoLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isPhotoLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isPhotoLoading = false;
      });
    }
  }

  validateForm(): any {
    if (this.notificationForm.invalid) {
      Object.keys(this.notificationForm.controls).forEach((key) => {
        this.notificationForm.controls[key].touched = true;
        this.notificationForm.controls[key].markAsDirty();
      });
      return false;
    }
    return true;
  }

  openPreviewNotification(): any {
    if (!this.validateForm()) {
      return false;
    }
    this._modalService.open("notification-pop");
  }

  createNotification(): any {
    if (!this.validateForm()) {
      return false;
    }
    this.isCreateNotificationLoading = true;
    this._promotionsService.createNotification(this.notificationForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._modalService.close("notification-pop");
        this._sNotify.success('Notification Created Successfully.', 'Success');
        this._router.navigate(['/promotions']);
        this.isCreateNotificationLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isCreateNotificationLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isCreateNotificationLoading = false;
    });
  }

  private _prepareNotificationForm(notificationObj: any = {}): void {
    this.notificationForm = this._formBuilder.group({
      notificationid: [this.notificationId || ''],
      notification_title: [notificationObj?.notification_title || '', [Validators.required]],
      link: [notificationObj?.link || '', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      banner: [notificationObj?.banner || '', [Validators.required]],
      description: [notificationObj?.description || '', [Validators.required]],
      notification_date: [notificationObj && notificationObj.notification_date ? new Date(notificationObj?.notification_date) : '', [Validators.required]],
      notification_time: [notificationObj?.notification_time || '', [Validators.required]],
      is_notification: [notificationObj?.is_notification  || true],
      is_email: [notificationObj?.is_email || false],
      is_sms: [notificationObj?.is_sms || false],
      email_template_id: [notificationObj?.email_template_id || '', [Validators.required]],
      status: [true],
    }, { validator: this.requireAtLeastOneCheckbox });
  }

  requireAtLeastOneCheckbox(control: AbstractControl) {
    const checkbox1 = control.get('is_notification').value;
    const checkbox2 = control.get('is_email').value;
    const checkbox3 = control.get('is_sms').value;

    if (!checkbox1 && !checkbox2 && !checkbox3) {
      return { requireAtLeastOne: true };
    }

    return null;
  }
}
