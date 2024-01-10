import { Component, OnInit, ViewChild } from '@angular/core';
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
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";

declare var $: any;

@Component({
  selector: 'app-company-details-step',
  templateUrl: './company-details-step.component.html',
  styleUrls: ['./company-details-step.component.scss']
})

export class CompanyDetailsStepComponent implements OnInit {
  @ViewChild('photosNgForm') photosNgForm: any;
  @ViewChild('videosNgForm') videosNgForm: any;
  @ViewChild('photoEditForm') photoEditForm: any;
  @ViewChild('videoEditForm') videoEditForm: any;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  PhoneNumberFormat = PhoneNumberFormat;
  // phoneForm: any;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined),
  });
  @ViewChild('phoneF') form: any;

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
  photoForm: any;
  videoForm: any;
  photoUpdateForm: any;
  videoUpdateForm: any;
  dropifyEditOption: any = {};
  dropifyVideoEditOption: any = {};
  editPhotoObj: any = {};
  editVideoObj: any = {};
  editDrEvent: any;
  editVideoDrEvent: any;

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
  videosUploadLimit: number = 10;
  rejectedVideosList: any;
  videosFiles: File[] = [];
  isHideDiscountitem: any = false;

  pincodeValidationObj: any = '';

  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimit: any = 0;

  isPhotoLoading: boolean = false;

  isOpenPopup: boolean = false;
  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  descriptionLimit: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _createEventService: CreateEventService,
    private _globalService: GlobalService,
    private _modalService: ModalService,
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this._globalService.isHideDiscountitem$.subscribe((isHideDiscountitem: boolean = false) => {
      this.isHideDiscountitem = isHideDiscountitem;
    });
    this.eventId = localStorage.getItem('eId');
    this.dropifyEditOption = {
      messages: {
        default: 'Add Image',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
    this.dropifyVideoEditOption = {
      messages: {
        default: 'Add Video',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
    this.editDrEvent = $('.editPoster').dropify(this.dropifyEditOption);
    this.editVideoDrEvent = $('.editVideo').dropify(this.dropifyVideoEditOption);
    this.photoForm = this._formBuilder.group({
      image: [null],
      imageName: [''],
      description: [null]
    });
    this.photoUpdateForm = this._formBuilder.group({
      image: [null],
      imageName: [''],
      description: [null]
    });
    this.videoForm = this._formBuilder.group({
      video: [null],
      videoName: [null],
      description: [null]
    });

    this.videoUpdateForm = this._formBuilder.group({
      video: [null],
      videoName: [null],
      description: [null]
    });
    this.getCompanyDetailsEvent();
    this._prepareCompanyDetailsForm();
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    
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
        if (companyDetailObj && companyDetailObj.country_wise_contact && companyDetailObj.country_wise_contact != '') { 
          this.phoneForm.patchValue({
            phone: companyDetailObj.country_wise_contact
          });
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
    if (pincode && pincode != '') {
      this.isLoading = true;
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

            this.companyForm?.controls['city']?.setErrors((this.pincodeValidationObj?.District && companyFormValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (companyFormValueObj?.city).toLowerCase()) ? { 'not_match': true } : null);
            this.companyForm?.controls['state']?.setErrors((this.pincodeValidationObj?.State && companyFormValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (companyFormValueObj?.state).toLowerCase()) ? { 'not_match': true } : null);
            this.companyForm?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && companyFormValueObj?.pincode && this.pincodeValidationObj.Pincode != companyFormValueObj?.pincode) ? { 'not_match': true } : null);

            this.companyForm.get('state').setValue(result[0]?.PostOffice[0]?.State);
            this.companyForm.get('city').setValue(result[0]?.PostOffice[0]?.District);
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            this.companyForm?.controls['pincode']?.setErrors({ 'pattern': true });
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
    this.isLoading = true;
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        const businessProfile: any = this._globalFunctions.copyObject(user?.businessProfile || {});
        businessProfile.contact_no = businessProfile.mobile;
        this._prepareCompanyDetailsForm(businessProfile);
        this.isLoading = false;
      }
    });
    this.isLoading = false;
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

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean,  isSingleVideo: boolean = false): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isSingleVideo = isSingleVideo;
    this.isOpenPopup = true;
  }
  closePop(flag: boolean): void {
    this.isOpenPopup = flag;
  }
  editImage(photo: any, index:number) {
    this.editPhotoObj = { index: index, type: 'photo', data: this.photoArr[index]};
    this.photoUpdateForm.controls['imageName'].setValue(this.constants.baseImageURL + photo.url);
    this.photoUpdateForm.controls['description'].setValue(photo.description);
    this.editDrEvent = this.editDrEvent.data('dropify');
    this.editDrEvent.resetPreview();
    this.editDrEvent.clearElement();
    this.editDrEvent.settings.defaultFile = this.constants.baseImageURL + photo.url;
    this.editDrEvent.destroy();
    this.editDrEvent.init();
    this.dropifyEditOption.defaultFile = this.constants.baseImageURL + photo.url;
    this.editDrEvent = $('.editPoster').dropify(this.dropifyEditOption);
    this._modalService.open("photoEdit");
  }
  openUploadPhotoDialog(): void {
    this.descriptionLimit = 0;
    //this.photosNgForm.resetForm();
    if (this.photoArr && this.photoArr.length && this.photoArr.length >= this.photosUploadLimit) {
      this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
    } else {
      this._modalService.open('photo');
    }
  }
  // Upload Images
  uploadImage(): any {
    const responseObj: Observable<any>[] = [];
    this.imagesFiles.forEach((image: any) => {
      if (image != undefined) {
        if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png' && image.type != 'image/gif' && image.type != 'image/avif' && image.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return;
        }

        // const image_size = image.size / 1024 / 1024;
        // if (image_size > CONSTANTS.maxImageSizeInMB) {
        //   this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
        //   return;
        // }

        if (this.photoArr && this.photoArr.length && this.photoArr.length >= this.photosUploadLimit) {
          this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
          this._modalService.close("photo");
          return;
        }

        const photoFormData = new FormData();
        photoFormData.append('file', image);
        this.isPhotoLoading = true;
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
          this.photoArr.push({ url: result.Data.url, description: this.photoForm.value?.description });
          this.photoForm.get('description').setValue('');
          this._sNotify.success('Image Uploaded Successfully.', 'Success');
          this.imagesFiles = [];
          this.isPhotoLoading = false;
          this.descriptionLimit = 0;
          this._modalService.close('photo');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isPhotoLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isPhotoLoading = false;
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
    this.deleteItemObj = { index: index, type: 'photo' };
    this._modalService.open("delete-event-pop");
  }

  onEditPosterChange(event: any): any {
    this.imgChangeEvt = event;
    if (event.target.files.length > 0) {
      const poster = event.target.files[0];
      if (poster != undefined) {
        if (poster.type != 'image/jpeg' && poster.type != 'image/jpg' && poster.type != 'image/png' && poster.type != 'image/gif' && poster.type != 'image/avif' && poster.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return false;
        }

        // const image_size = poster.size / 1024 / 1024;
        // if (image_size > CONSTANTS.maxPosterSizeInMB) {
        //   this._sNotify.error('Maximum Poster Size is ' + CONSTANTS.maxPosterSizeInMB + 'MB.', 'Oops!');
        //   return false;
        // }
        this.photoUpdateForm.controls['image'].setValue(poster);
        //this.savePoster(poster);
      }
    }
  }

  // Images Upload for Edit & Check image exist & new
  editUploadImage(): any {
    if (this.photoUpdateForm.value.image === null) {
      this.photoArr[this.editPhotoObj.index].description = this.photoUpdateForm.value.description;
      this._modalService.close('photoEdit');
    } else {
      if (this.photoUpdateForm.value.image !== null) {
        const photoFormData = new FormData();
        photoFormData.append('file', this.photoUpdateForm.value.image);
        this.isPhotoLoading = true;
        this._createEventService.uploadImages(photoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.photoArr[this.editPhotoObj.index].url = result.Data.url;
            this.photoArr[this.editPhotoObj.index].description = this.photoUpdateForm.value.description;
            this._sNotify.success('File Uploaded Successfully.', 'Success');
            this.isPhotoLoading = false;
            this._modalService.close("photoEdit");
          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isPhotoLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isPhotoLoading = false;
        });
      } else {
        this._sNotify.success('Something went wrong!', 'Oops');
      }
    }
  }
  // Upload Videos
  uploadVideo(): any {
    const responseObj: Observable<any>[] = [];
    this.videosFiles.forEach((video: any) => {
      if (video != undefined) {
        if (video.type != 'video/mp4' && video.type != 'video/mov' && video.type != 'video/wmv' && video.type != 'video/avi' && video.type != 'video/mkv' && video.type != 'video/flv' && video.type != 'video/f4v' && video.type != 'video/swf') {
          this._sNotify.error('Video type should only MP4, MOV, WMV, AVI, MKV, FLV, F4V and SWF', 'Oops!');
          return;
        }

        // const video_size = video.size / 1024 / 1024;
        // if (video_size > CONSTANTS.maxVideoSizeInMB) {
        //   this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
        //   return;
        // }

        if (this.videoArr && this.videoArr.length && this.videoArr.length >= 10) {
          this._sNotify.error('Maximum 10 videos can upload!', 'Oops!');
          return;
        }

        const videoFormData = new FormData();
        videoFormData.append('file', video);
        this.isVideoLoading = true;
        responseObj.push(this._createEventService.uploadVideos(videoFormData));
        console.log(videoFormData);
      }
    });

    forkJoin(...responseObj).subscribe((resultArr: any) => {
      _.each(resultArr, (result: any) => {
        if (result && result.IsSuccess) {
          this.videoArr.push({ url: result.Data.url, description: this.videoForm.value?.description });
          this.videoForm.get('description').setValue('');
          this._sNotify.success('Video Uploaded Successfully.', 'Success');
          this.videosFiles = [];
          this.isVideoLoading = false;
          $('#create-video-upload').val(null);
          this._modalService.close('video');
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
    this.deleteItemObj = { index: index, type: 'video' };
    this._modalService.open("delete-event-pop");
  }
  openUploadVideoDialog(): void {
    this.descriptionLimit = 0;
    this.videosNgForm.resetForm();
    if (this.videoArr && this.videoArr.length && this.videoArr.length >= 10) {
      this._sNotify.error('Maximum 10 videos can upload!', 'Oops!');
    } else {
      this._modalService.open('video');
    }
  }

  editVideoModal(video: any, index:number) {
    this.editVideoObj = { index: index, type: 'video', data: this.videoArr[index]};
    this.videoUpdateForm.controls['videoName'].setValue(this.constants.baseImageURL + video.url);
    this.videoUpdateForm.controls['description'].setValue(video.description);
    this.editVideoDrEvent = this.editVideoDrEvent.data('dropify');
    this.editVideoDrEvent.resetPreview();
    this.editVideoDrEvent.clearElement();
    this.editVideoDrEvent.settings.defaultFile = this.constants.baseImageURL + video.url;
    this.editVideoDrEvent.destroy();
    this.editVideoDrEvent.init();
    this.dropifyVideoEditOption.defaultFile = this.constants.baseImageURL + video.url;
    this.editVideoDrEvent = $('.editVideo').dropify(this.dropifyVideoEditOption);
    this._modalService.open("videoEdit");
  }
  onEditVideoChange(event: any): any {
    this.imgChangeEvt = event;
    if (event.target.files.length > 0) {
      const video = event.target.files[0];
      if (video != undefined) {
        if (video.type != 'video/mp4' && video.type != 'video/x-m4v' && video.type != 'video/*') {
          this._sNotify.error('Videos type should only mp4, avi and raw.', 'Oops!');
          return false;
        }

        // const image_size = video.size / 1024 / 1024;
        // if (image_size > CONSTANTS.maxVideoSizeInMB) {
        //   this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
        //   return false;
        // }
        this.videoUpdateForm.controls['video'].setValue(video);
      }
    }
  }
  editUploadVideo(): any {
    if (this.videoUpdateForm.value.video === null) {
      this.videoArr[this.editVideoObj.index].description = this.videoUpdateForm.value.description;
      this._modalService.close('videoEdit');
    } else {
      if (this.videoUpdateForm.value.video !== null) {
        const videoFormData = new FormData();
        videoFormData.append('file', this.videoUpdateForm.value.video);
        this.isVideoLoading = true;
        this._createEventService.uploadVideos(videoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.videoArr[this.editVideoObj.index].url = result.Data.url;
            this.videoArr[this.editVideoObj.index].description = this.videoUpdateForm.value.description;
            this._sNotify.success('File Uploaded Successfully.', 'Success');
            this.isVideoLoading = false;
            this._modalService.close("videoEdit");

          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isVideoLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isVideoLoading = false;
        });
      } else {
        this._sNotify.success('Something went wrong!', 'Oops');
      }
    }
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

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  nextStep(): void {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.phoneForm.invalid) {
      this.form.form.controls['phone'].touched = true;
      this.phoneForm.controls['phone'].markAsDirty();
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
        console.log("Company Details",result);
        
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

  private _prepareCompanyDetailsForm(companyDetailObj: any = {}): void {
    this.companyForm = this._formBuilder.group({
      name: [companyDetailObj?.name || '', [Validators.minLength(2)]],
      gst: [this.gstPdf || ''],
      contact_no: [companyDetailObj?.contact_no || ''],
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

  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    preparedObj.eventid = this.eventId;
    preparedObj.gst = this.gstPdf;
    preparedObj.photos = this.photoArr;
    preparedObj.videos = this.videoArr;
    preparedObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedObj.dial_code = preparedObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedObj.country_wise_contact?.e164Number || '';
    preparedObj.contact_no = contactNumber.replace(preparedObj.dial_code, '') || '';
    return preparedObj;
  }
}
