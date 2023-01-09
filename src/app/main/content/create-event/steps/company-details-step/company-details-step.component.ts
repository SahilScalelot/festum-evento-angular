import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from '../../create-event.service';
import * as _ from 'lodash';
import { ModalService } from 'src/app/main/_modal';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

declare var $: any;

@Component({
  selector: 'app-company-details-step',
  templateUrl: './company-details-step.component.html',
  styleUrls: ['./company-details-step.component.scss']
})

export class CompanyDetailsStepComponent implements OnInit {
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
  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];

  eventId: any;
  gstPdf: any;
  
  allPhotosFilesArr: any = [];
  allVideosFilesArr: any = [];

  isInValidPDF: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _createEventService: CreateEventService,
    private _globalService: GlobalService,
    private _modalService: ModalService,
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
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
      about: [companyDetailObj?.about || '', [Validators.required]],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      city: [companyDetailObj?.city || '', [Validators.required]],
      state: [companyDetailObj?.state || '', [Validators.required]],
      pincode: [companyDetailObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      photos: [this.photoArr || []],
      videos: [this.videoArr || []],
    });

    this.inputText = companyDetailObj?.company_details?.company_detail?.gst_name;
  }
  
  getCompanyDetailsEvent(): any {
    this.isLoading = true;
    this._createEventService.getCompanyDetail(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const companyDetailObj: any = result?.Data?.companydetail || {};
        if (companyDetailObj && companyDetailObj.pincode && companyDetailObj.pincode != '') {
          this._prepareCompanyDetailsForm(companyDetailObj);
        } else {
          this.getDataFromProfileObj();
        }
        this.gstPdf = companyDetailObj.gst;
        this.inputText = _.last(_.split(companyDetailObj.gst, '/'));
        this.photoArr = companyDetailObj.photos || [];
        this.videoArr = companyDetailObj.videos || [];        
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

  getDataFromProfileObj(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        const businessProfile: any = this._globalFunctions.copyObject(user?.businessProfile || {});
        businessProfile.contact_no = businessProfile.mobile;
        this._prepareCompanyDetailsForm(businessProfile);
      }
    });
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
      this._createEventService.documentUpload(pdfFormData).subscribe((result: any) => {
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

  uploadImage(): any {
    const image = $('#create-photo-upload')[0].files[0];
    const imgFormData = new FormData();
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

      imgFormData.append('file', image);
      this.isImgLoading = true;
      this._createEventService.uploadImages(imgFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const photo = result.Data.url;
          this.photoArr.push({ url: photo });
          this._sNotify.success('Image Uploaded Successfully.', 'Success');
          this.isImgLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isImgLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isImgLoading = false;
      });
      $('#create-photo-upload').val(null);
    }
    

  }

  uploadVideo(): any {
    const video = $('#create-video-upload')[0].files[0];
    const videoFormData = new FormData();
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
      videoFormData.append('file', video);
      this.isVideoLoading = true;
      this._createEventService.uploadVideos(videoFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const video = result.Data.url;
          this.videoArr.push({ url: video });
          this._sNotify.success('Video Uploaded Successfully.', 'Success');
          this.isVideoLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isVideoLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isVideoLoading = false;
      });
      $('#create-video-upload').val(null);
    }
  }

  removeImage(index: number) {
    // this.photoArr.splice(index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
    this.deleteItemObj = {index: index, type: 'photo'};
    this._modalService.open("delete-event-pop");
  }

  removeVideo(index: number) {
    // this.videoArr.splice(index, 1);
    // this.allVideosFilesArr.splice(index, 1);
    this.deleteItemObj = {index: index, type: 'video'};
    this._modalService.open("delete-event-pop");
  }

  close(): void {
    this.deleteItemObj = {};
    this._modalService.close("delete-event-pop");
  }

  deleteEvent(): void {
    this.isDeleteLoading = true;

    switch (this.deleteItemObj.type) {
      case 'photo':
        this.photoArr.splice(this.deleteItemObj.index, 1);
        break;
      case 'video':
        this.videoArr.splice(this.deleteItemObj.index, 1);
        break;
    }
    // if (this.deleteItemObj.type == 'photo') {
    //   this.photoArr.splice(this.deleteItemObj.index, 1);
    // }
    // const preparedCompanyDetailsObj: any = this.prepareObj(this.companyForm.value);
    // preparedCompanyDetailsObj[this.deleteItemObj.type + 's'].splice(this.deleteItemObj.index, 1);
    this.isDeleteLoading = false;
    this.close();
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
    this._createEventService.companyDetail(preparedCompanyDetailsObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.companyForm.enable();
        this._router.navigate(['/events/create/personal-details']);
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
    preparedObj.eventid = this.eventId;
    preparedObj.gst = this.gstPdf;
    preparedObj.photos = this.photoArr;
    preparedObj.videos = this.videoArr;
    return preparedObj;
  }
}
