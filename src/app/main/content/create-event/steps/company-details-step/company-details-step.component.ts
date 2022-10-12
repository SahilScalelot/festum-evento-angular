import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  pdfObj: any = [];
  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];
  permissionObj: any = [];

  isInValidPDF: boolean = false;

  reactiveForm!: FormGroup;

  companyObj: any = {company_details: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.companyObj = JSON.parse(eventString);
      if (this.companyObj) {
        this.photoArr = this.companyObj?.company_details?.photo || [];
        this.videoArr = this.companyObj?.company_details?.video || [];
      }
    }
    
    this.companyForm = this._formBuilder.group({
      name: [this.companyObj?.company_details?.name, [Validators.minLength(2)]],
      gst: [''],
      contact_no: [this.companyObj?.company_details?.contact_no, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [this.companyObj?.company_details?.email, [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about: [this.companyObj?.company_details?.about],
      flat_no: [this.companyObj?.company_details?.flat_no],
      street: [this.companyObj?.company_details?.street],
      area: [this.companyObj?.company_details?.area],
      city: [this.companyObj?.company_details?.city, Validators.required],
      state: [this.companyObj?.company_details?.state, Validators.required],
      pincode: [this.companyObj?.company_details?.pincode, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      images: [this.photoArr],
      videos: [this.videoArr],
      // images: [this.photoArr],
      // videos: [this.videoArr],
    });
  }

  onChangePDF(event: any): any {
    const pdfUpload = $('#company-gst')[0].files[0];
    this.isInValidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload != undefined && pdfUpload.type != 'application/pdf') {
        // this._sNotify.error('File type is Invalid.', 'Oops!');
        $('#company-gst').focus();
        this.isInValidPDF = true;
        return false;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfObj.push({ pdfUpload: e.target.result });
      };
      reader.readAsDataURL(pdfUpload);
      
      this.inputText = event?.target?.files[0]?.name;
      console.log(this.inputText);

      this.companyForm.get('gst').setValue(this.inputText);
    }
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

      const video_size = video.size / 1024 / 1024 / 1024;
      if (video_size > CONSTANTS.maxCompanyVideoSizeInMB) {
        this._sNotify.error('Maximum Company Video Size is ' + CONSTANTS.maxCompanyVideoSizeInMB + 'GB.', 'Oops!');
        $('#create-video-upload').focus();
        return false;
      }
      
      if (this.videoArr && this.videoArr.length && this.videoArr.length >= 1) {
        this._sNotify.error('Maximum 1 videos can upload!', 'Oops!');
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

  companyDetails(): void {
    if (this.companyForm.invalid) {
      // this.companyForm.controls.markAsDirty();
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }

    const preparedObj = this.prepareObj(this.companyForm.value);
    this.companyObj.company_details = preparedObj;
    
    JSON.stringify({company_details: preparedObj});
    localStorage.setItem('newEventObj', JSON.stringify(this.companyObj));
    this._router.navigate(['/create-event/personal-details']);
  }
  
  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    return preparedObj;
  }
}
