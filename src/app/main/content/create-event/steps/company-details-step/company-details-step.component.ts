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
import { forkJoin, Observable, switchMap } from 'rxjs';

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
  
  photosUploadLimit: number = 5;
  rejectedPhotosList: any;
  imagesFiles: File[] = [];
  videosUploadLimit: number = 1;
  rejectedVideosList: any;
  videosFiles: File[] = [];
  isHideDiscountitem: any = false;

  pincodeValidationObj: any = '';
  
  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimit: any = 0;

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
    this._globalService.isHideDiscountitem$.subscribe((isHideDiscountitem: boolean = false) => {
      this.isHideDiscountitem = isHideDiscountitem;
    });
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
      about: [companyDetailObj?.about || ''],
      flat_no: [companyDetailObj?.flat_no || ''],
      street: [companyDetailObj?.street || ''],
      area: [companyDetailObj?.area || ''],
      city: [companyDetailObj?.city || ''],
      state: [companyDetailObj?.state || ''],
      pincode: [companyDetailObj?.pincode || '', [Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      photos: [this.photoArr || []],
      videos: [this.videoArr || []],
    });

    this.inputText = companyDetailObj?.company_details?.company_detail?.gst_name;
    this.pincodeValidation(this.companyForm.value.pincode);
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

  pincodeValidation(pincode: any = ''): any {
    this.isLoading = true;
    if (pincode && pincode != '') {
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
            
            this.companyForm?.controls['city']?.setErrors((this.pincodeValidationObj?.District && companyFormValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (companyFormValueObj?.city).toLowerCase()) ? {'not_match': true} : null);
            this.companyForm?.controls['state']?.setErrors((this.pincodeValidationObj?.State && companyFormValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (companyFormValueObj?.state).toLowerCase()) ? {'not_match': true} : null);
            this.companyForm?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && companyFormValueObj?.pincode && this.pincodeValidationObj.Pincode != companyFormValueObj?.pincode) ? {'not_match': true} : null);
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            this.companyForm?.controls['pincode']?.setErrors({'pattern': true});
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

  // Upload Images
  uploadImage(): any {
    const responseObj: Observable<any>[] = [];
    this.imagesFiles.forEach((image: any) => {
      if (image != undefined) {
        if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png') {
          this._sNotify.error('Image type is Invalid.', 'Oops!');
          return;
        }

        const image_size = image.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxImageSizeInMB) {
          this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
          return;
        }

        if (this.photoArr && this.photoArr.length && this.photoArr.length >= this.photosUploadLimit) {
          this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
          this._modalService.close("photo");
          return;
        }

        const photoFormData = new FormData();
        photoFormData.append('file', image);
        this.isImgLoading = true;
        responseObj.push(this._createEventService.uploadImages(photoFormData));
      }
    });

    forkJoin(...responseObj)
    .pipe(
      switchMap((result: any) => {
        return result;
      })
    )
    .subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.photoArr.push({ url: result.Data.url });
        this._sNotify.success('Image Uploaded Successfully.', 'Success');
        this.imagesFiles = [];
        this.isImgLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isImgLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isImgLoading = false;
    });
  }
  onSelectImages(event: any) {
    const totalPhotos = this.photosUploadLimit - ((this.photoArr?.length || 0) + (event?.addedFiles?.length || 0) + (this.imagesFiles?.length || 0));
    if ((totalPhotos >= 0) && (totalPhotos <= this.photosUploadLimit)) {
      this.imagesFiles.push(...event.addedFiles);
      this.rejectedPhotosList = event?.rejectedFiles;
    } else {
      this._sNotify.warning('You have exceeded the maximum photos limit!', 'Oops..');
    }
  }
  onRemoveImages(event: any) {
    this.imagesFiles.splice(this.imagesFiles.indexOf(event), 1);
  }
  removeImage(index: number) {
    // this.photoArr.splice(index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
    this.deleteItemObj = {index: index, type: 'photo'};
    this._modalService.open("delete-event-pop");
  }

  // Upload Videos
  uploadVideo(): any {
    const responseObj: Observable<any>[] = [];
    this.videosFiles.forEach((video: any) => {
      if (video != undefined) {
        if (video.type != 'video/mp4') {
          this._sNotify.error('Video type should only mp4.', 'Oops!');
          return;
        }

        const video_size = video.size / 1024 / 1024;
        if (video_size > CONSTANTS.maxVideoSizeInMB) {
          this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
          return;
        }

        if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
          this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
          return;
        }

        const videoFormData = new FormData();
        videoFormData.append('file', video);
        this.isVideoLoading = true;
        responseObj.push(this._createEventService.uploadVideos(videoFormData));
      }
    });

    forkJoin(...responseObj).subscribe((resultArr: any) => {
      _.each(resultArr, (result: any) => {
        if (result && result.IsSuccess) {
          this.videoArr.push({ url: result.Data.url });
          this._sNotify.success('Video Uploaded Successfully.', 'Success');
          this.videosFiles = [];
          this.isVideoLoading = false;
          $('#create-video-upload').val(null);
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isVideoLoading = false;
        }
      });
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isVideoLoading = false;
    });
  }
  onSelectVideos(event: any) {
    const totalVideos = this.videosUploadLimit - ((this.videoArr?.length || 0) + (event?.addedFiles?.length || 0) + (this.videosFiles?.length || 0));
    if ((totalVideos >= 0) && (totalVideos <= this.videosUploadLimit)) {
      this.videosFiles.push(...event.addedFiles);
      this.rejectedVideosList = event?.rejectedFiles;
    } else {
      this._sNotify.warning('You have exceeded the maximum videos limit!', 'Oops..');
    }
  }
  onRemoveVideos(event: any) {
    this.videosFiles.splice(this.videosFiles.indexOf(event), 1);
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

  editorCharacterSet(): any {
    const textfield = this.companyForm.value.about;
    const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
    this.textEditorLimit = stringOfCKEditor.length;
    this.textEditor = (stringOfCKEditor.length > this.textEditorMaxLimit);
  }

  nextStep(): void {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }
    this.editorCharacterSet();
    if (this.textEditorLimit && this.textEditorMaxLimit && this.textEditorLimit > this.textEditorMaxLimit) {
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
