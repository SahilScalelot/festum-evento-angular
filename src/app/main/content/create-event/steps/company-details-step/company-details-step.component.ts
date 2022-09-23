import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';

declare var $: any;
@Component({
  selector: 'app-company-details-step',
  templateUrl: './company-details-step.component.html',
  styleUrls: ['./company-details-step.component.scss']
})
export class CompanyDetailsStepComponent implements OnInit {
  imgChangeEvt: any = '';

  companyForm: any;
  inputText: any;

  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];
  permissionObj: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService
  ) { }

  ngOnInit(): void {
    this.companyForm = this._formBuilder.group({
      name: ['', Validators.required],
      gst: [''],
      contact_no: ['', Validators.required],
      email: ['', Validators.required],
      about: [''],
      flat_no: [''],
      street: [''],
      area: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      images: [this.photoArr],
      videos: [this.videoArr],
    });
  }

  validate(): boolean {
    if (!this.companyForm.value.name || this.companyForm.value.name === "") {
      this._sNotify.error('Name is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.contact_no || this.companyForm.value.contact_no === "") {
      this._sNotify.error('Contact No is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.email || this.companyForm.value.email === "") {
      this._sNotify.error('Email is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.city || this.companyForm.value.city === "") {
      this._sNotify.error('City is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.state || this.companyForm.value.state === "") {
      this._sNotify.error('State is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.pincode || this.companyForm.value.pincode === "") {
      this._sNotify.error('Pincode is required!', 'Oops!');
      return false;
    }
    return true;
  }

  companyDetails(): void {
    // console.log(this.companyForm.value);
    // if (this.companyForm.invalid) {
    //   return;
    // }

    // if (!this.validate()) {
    //   return;
    // }
    console.log(this.companyForm.value);
  }

  onChangePDF(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  uploadImage(): any {
    const image = $('#create-photo-upload')[0].files[0];
    if (image != undefined) {
      if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png') {
        this._sNotify.error('Image type is Invalid.', 'Oops!');
        $('#create-photo-upload').focus();
        return false;
      }

      const image_size = image.size / 1024 / 1024;
      if (image_size > CONSTANTS.maxImageSizeInMB) {
        this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
        $('#create-photo-upload').focus();
        return false;
      }

      if (this.photoArr && this.photoArr.length && this.photoArr.length >= 5) {
        this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoArr.push({ image: e.target.result });
      };
      reader.readAsDataURL(image);
    }
  }

  uploadVideo(): any {
    const video = $('#create-video-upload')[0].files[0];
    if (video != undefined) {
      if (video.type != 'video/mp4') {
        this._sNotify.error('Video type should only mp4.', 'Oops!');
        $('#create-video-upload').focus();
        return false;
      }

      const video_size = video.size / 1024 / 1024;
      if (video_size > CONSTANTS.maxVideoSizeInMB) {
        this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
        $('#create-video-upload').focus();
        return false;
      }

      if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
        this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoArr.push({ video: e.target.result });
      };
      reader.readAsDataURL(video);
    }
  }

  removeImage(index: number) {
    this.photoArr.splice(index, 1);
  }

  removeVideo(index: number) {
    this.videoArr.splice(index, 1);
  }
}
