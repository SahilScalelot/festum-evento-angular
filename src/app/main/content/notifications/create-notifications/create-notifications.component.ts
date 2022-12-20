import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {NotificationsService} from "../notifications.service";
import * as _ from "lodash";
import {GlobalFunctions} from "../../../common/global-functions";
import {CONSTANTS} from "../../../common/constants";
import {ModalService} from "../../../_modal";

@Component({
  selector: 'app-create-notifications',
  templateUrl: './create-notifications.component.html',
  styleUrls: ['./create-notifications.component.scss']
})
export class CreateNotificationsComponent implements OnInit {
  notificationForm: any;
  notificationId: any = '';
  editorConfig: any = {};
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
    private _notificationService: NotificationsService,
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
  }

  onTextEditorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getNotificationById(notificationId: any): void {
    this.isLoading = true;
    this._notificationService.getNotificationById(notificationId).subscribe((result: any) => {
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
      if (image_size > CONSTANTS.maxImageSizeInMB) {
        this._sNotify.error('Maximum Photo Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
        return false;
      }

      const imageFormData = new FormData();
      imageFormData.append('file', image);
      this.isPhotoLoading = true;
      this._notificationService.uploadBanner(imageFormData).subscribe((result: any) => {
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
    this._notificationService.createNotification(this.notificationForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._modalService.close("notification-pop");
        this._sNotify.success('Notification Created Successfully.', 'Success');
        this._router.navigate(['/notifications']);
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
      status: [true],
    });
  }

}
