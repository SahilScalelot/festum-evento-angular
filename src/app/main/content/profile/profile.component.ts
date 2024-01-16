import { Component, NgZone, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Validators,FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { ProfileService } from './profile.service';
import { GlobalFunctions } from '../../common/global-functions';
import * as moment from 'moment';
import { SnotifyService } from 'ng-snotify';
import * as _ from 'lodash';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MapsAPILoader } from '@agm/core';
import { ModalService } from 'src/app/main/_modal';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";


declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
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
    p_phone: new FormControl(undefined, [Validators.required]),
    a_phone: new FormControl(undefined),
    phone: new FormControl(undefined),
  });
  @ViewChild('phoneF') form: any;
  isPhotoLoading: boolean = false;
  rejectedVideosList: any;
  isLoading: boolean = false;
  isOpenPopup: boolean = false;
  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  descriptionLimit: any = 0;
  isImageLoading: boolean = false;
  constants: any = CONSTANTS;
  isEditProfile: boolean = false;
  isEditBusinessProfile: boolean = false;
  profile_pic: any = '';
  business_profile_pic: any = '';
  profileForm: any;
  isPdfLoading: boolean = false;
  businessForm: any;
  kycForm: any;
  rejectedPhotosList: any;
  profileObj: any = {};
  businessObj: any = {};
  maxDate: Date = new Date();
  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];
  photoForm: any;
  videoForm: any;
  companyForm: any;
  inputText: any;
  photoUpdateForm: any;
  videoUpdateForm: any;
  dropifyEditOption: any = {};
  dropifyVideoEditOption: any = {};
  editPhotoObj: any = {};
  editVideoObj: any = {};
  editDrEvent: any;
  editVideoDrEvent: any;
  allPhotosFilesArr: any = [];
  allVideosFilesArr: any = [];
  companyDetailObj: any = {};
  photosUploadLimit: number = 5;
  imagesFiles: File[] = [];
  videosUploadLimit: number = 2;
  videosFiles: File[] = [];
  isHideDiscountitem: any = false;
  pdfObj: any = [];
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  @ViewChild('search') public searchElementRef: ElementRef | any;
  isInValidPDF: boolean = false;
  gstPdf: any;
  deleteItemObj: any = {};
  imgChangeEvt: any = '';
  // videosNgForm: any;
  isImgLoading: boolean = false;
  isVideoLoading: boolean = false;
  isDeleteLoading: boolean = false;
  kycObj: any;
  isKyc: boolean = false;
  selectedItemImg: string | ArrayBuffer;
  passbookImage: string | ArrayBuffer;
  panImage: string | ArrayBuffer;
  nk: any;

  get profileFirstName() {
    return this.profileForm.get('name')
  }

  get profileDob() {
    return this.profileForm.get('dob')
  }

  get profileCity() {
    return this.profileForm.get('city')
  }

  get profilePincode() {
    return this.profileForm.get('pincode')
  }

  get profileState() {
    return this.profileForm.get('state')
  }

  get profileCountry() {
    return this.profileForm.get('country')
  }

  get businessFirstName() {
    return this.businessForm.get('name')
  }

  get businessDob() {
    return this.businessForm.get('dob')
  }

  get businessAddress() {
    return this.businessForm.get('address')
  }

  get businessCountry() {
    return this.businessForm.get('country')
  }

  pincodeValidationObj: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _profileService: ProfileService,
    private _modalService: ModalService,
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }


  ngOnInit(): void {
    this._prepareProfileForm();
    this._prepareBusinessForm();
    this._prepareKycForm();
    this.getProfileDetails();
    this.maxDate = new Date();

    // this._getUserDetail();
    this.pincodeValidation(this.profileObj.pincode);

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
  }
  

  getProfileDetails() {
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.profileObj = user;
        this.kycObj = user.kyc_details;
        this._prepareProfileForm(this.profileObj);
        this._prepareKycForm(this.kycObj);
        this._prepareBusinessForm(this.profileObj?.businessProfile);
        this.phoneForm.patchValue({
          p_phone:  this.profileObj.mobile,
          a_phone: this.profileObj.alt_mobile_no,
          
        });
        this.profile_pic = CONSTANTS.baseImageURL + this.profileObj?.profile_pic;
        if (this.profileObj?.businessProfile?.profile_pic) {
          this.business_profile_pic = CONSTANTS.baseImageURL + this.profileObj?.businessProfile?.profile_pic;
          this.businessObj = this.profileObj?.businessProfile;
          this.photoArr = this.businessObj?.photos || [];
          this.videoArr = this.businessObj?.videos || [];
          if (this.businessObj && this.businessObj.country_wise_contact && this.businessObj.country_wise_contact != '') { 
            this.phoneForm.patchValue({
              phone: this.businessObj.mobile
            });
          }
          this._prepareBusinessForm(this.businessObj);
        }
        this.isLoading = false;
      }
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
          responseObj.push(this._profileService.uploadVideos(videoFormData));
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
    onSelectVideos(event: any) {
      const totalVideos = this.videosUploadLimit - ((this.videoArr?.length || 0) + (event?.addedFiles?.length || 0) + (this.videosFiles?.length || 0));
      if ((totalVideos >= 0) && (totalVideos <= this.videosUploadLimit)) {
        this.videosFiles.push(...event.addedFiles);
        this.rejectedVideosList = event?.rejectedFiles;
      } else {
        this._sNotify.warning('You have exceeded the maximum videos limit!', 'Oops..');
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
          responseObj.push(this._profileService.uploadImages(photoFormData));
          
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
        this._profileService.uploadImages(photoFormData).subscribe((result: any) => {
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

  removeImage(index: number) {
    // this.photoArr.splice(index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
    this.deleteItemObj = { index: index, type: 'photo' };
    this._modalService.open("delete-event-pop");
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
        this._profileService.uploadVideos(videoFormData).subscribe((result: any) => {
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
      this._profileService.documentUpload(pdfFormData).subscribe((result: any) => {
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

  onTextEditorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  pincodeValidation(pincode: any = '', isBusinessProfile: boolean = false): any {
    if (pincode && pincode != '') {
      this.isLoading = true;
      this._globalService.pincodeValidation(pincode).subscribe((result: any) => {
        if (result && result[0] && result[0].Status) {
          const formName = isBusinessProfile ? this.businessForm : this.profileForm;
          if (result[0].Status == 'Success') {
            this.pincodeValidationObj = result[0].PostOffice[0];
            const formValueObj = formName?.value || {};

            formName.markAsTouched();
            formName?.get('city')?.markAsTouched();
            formName?.get('state')?.markAsTouched();
            formName?.get('pincode')?.markAsTouched();
            formName?.controls['city']?.markAsDirty();
            formName?.controls['state']?.markAsDirty();
            formName?.controls['pincode']?.markAsDirty();

            formName?.controls['city']?.setErrors((this.pincodeValidationObj?.District && formValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (formValueObj?.city).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['state']?.setErrors((this.pincodeValidationObj?.State && formValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (formValueObj?.state).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && formValueObj?.pincode && this.pincodeValidationObj.Pincode != formValueObj?.pincode) ? { 'not_match': true } : null);
            
            formName.get('state').setValue(result[0]?.PostOffice[0]?.State);
            formName.get('city').setValue(result[0]?.PostOffice[0]?.District);
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            formName?.controls['pincode']?.setErrors({ 'pattern': true });
            this.isLoading = false;
          }
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }
  // private _getUserDetail(): void {
  //   this.isLoading = true;
  //   this._authService.getLoginUser().subscribe((result: any) => {
  //     if (result.IsSuccess) {
  //       this.profileObj = result.user;
  //       this._prepareProfileForm();
  //       this.isLoading = false;
  //     }
  //   });
  // }

  onUpdateProfilePic(event: any, isBusinessProfile: boolean = false): void {
    if (event.target.files && event.target.files[0]) {
      this.isImageLoading = true;
      const file = event.target.files[0];
      const profilePicObj: any = new FormData();
      profilePicObj.append('file', file);
      this._profileService.updateProfilePic(profilePicObj, isBusinessProfile).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.msg, 'Success');
          this.enableFields();
          this.isImageLoading = false;
          // window.location.reload();
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isImageLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }

  updatePersonalProfile(): any {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.controls[key].touched = true;
        this.profileForm.controls[key].markAsDirty();
      });
      return;
    }

    if (this.profileForm.valid) {
      this.profileForm.value.dob = moment(this.profileForm.value.dob).format('DD-MM-YYYY');
      const preparedProfileObj: any = this.pprepareObj(this.profileForm.value);
      this.isLoading = true;
      
      this._profileService.updateProfile(preparedProfileObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.Message, 'Success');
          // this.enableFields();
          this.isEditProfile = false;
          this.isLoading = false;
          // window.location.reload();
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }
  updateKycDetail(): any {
    debugger
    if (this.kycForm.invalid) {
      Object.keys(this.kycForm.controls).forEach((key) => {
        this.kycForm.controls[key].touched = true;
        this.kycForm.controls[key].markAsDirty();
      });
      return;
    }
 
    if (this.kycForm.valid) {

      const fileObj: any = new FormData();
      fileObj.append('upi_id', this.kycForm.value.upi_id || "");
      fileObj.append('pan_card_no', this.kycForm.value.pan_card_no);
      fileObj.append('bank_account_holder_name', this.kycForm.value.bank_account_holder_name);
      fileObj.append('bank_account_no', this.kycForm.value.bank_account_no);
      fileObj.append('bank_ifsc_code', this.kycForm.value.bank_ifsc_code);
      fileObj.append('pan_card_photo', this.kycForm.value.pan_card_photo);
      fileObj.append('bank_passbook_photo', this.kycForm.value.bank_passbook_photo);

      // const preparedKycObj: any = this.kycForm.value;
      this.isLoading = true;
      this._profileService.kycDetail(fileObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.Message, 'Success');
          // this.enableFields();
          this.isKyc = false;
          this.isLoading = false;
          // window.location.reload();
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isKyc = false;
        }
      }, (error: any) => {
        this.isLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
        this.isKyc = false;
      });
    }
  }
  pprepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    // preparedObj.eventid = this.eventId;
    // preparedObj.gst = this.gstPdf;
    // preparedObj.photos = this.photoArr;
    // preparedObj.videos = this.videoArr;
    preparedObj.alt_country_wise_contact = this.phoneForm?.value?.a_phone || undefined;
    preparedObj.alt_dial_code = preparedObj.alt_country_wise_contact?.dialCode || '';
    const contactNumber = preparedObj.alt_country_wise_contact?.e164Number || '';
    preparedObj.alt_mobile_no = contactNumber.replace(preparedObj.alt_dial_code, '') || '';
    return preparedObj;
  }

  preparePersonalProfileObj(personalProfileObj: any): any {
    const personalProfileDataObj = new FormData();
    $.each(personalProfileObj, function (field: any, value: any) {
      if (field !== 'profile_pic' && field !== 'isChangeProfilePic') {
        personalProfileDataObj.append(field, value);
      }
    });

    const profile_pic = $('input[id=profile_pic]')[0].files[0];
    if (profile_pic !== undefined) {
      personalProfileDataObj.append('profile_pic', profile_pic);
    }

    return personalProfileDataObj;
  }

  updateBusinessProfile() {
    if (this.businessForm.invalid) {
      Object.keys(this.businessForm.controls).forEach((key) => {
        this.businessForm.controls[key].touched = true;
        this.businessForm.controls[key].markAsDirty();
      });
      return ;
    }
    if (this.businessForm.valid) {
      const preparedCompanyDetailsObj: any = this.prepareObj(this.businessForm.value);
      // const preparedBusinessObj: any = this._globalFunctions.copyObject(this.businessForm.value);
      
      this.isLoading = true;
      this._profileService.updateBusiness(preparedCompanyDetailsObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.Message, 'Success');
          // this.enableFields();
          this.isEditBusinessProfile = false;
          this.isLoading = false;
          // window.location.reload();
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }
  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    // preparedObj.eventid = this.eventId;
    // preparedObj.gst = this.gstPdf;
    preparedObj.photos = this.photoArr;
    preparedObj.videos = this.videoArr;
    preparedObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedObj.country_code = preparedObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedObj.country_wise_contact?.e164Number || '';
    preparedObj.mobile = contactNumber.replace(preparedObj.country_code, '') || '';
    return preparedObj;
  }

  enableFields(isBusinessProfile: boolean = false): void {
    if (isBusinessProfile) {
      this.isEditBusinessProfile = true;
      this.businessForm.get('name').enable();
      this.businessForm.get('mobile').enable();
      this.businessForm.get('email').enable();
      this.businessForm.get('country').enable();
      this.businessForm.get('country_code').enable();
      this.businessForm.get('about').enable();
      this.businessForm.get('flat_no').enable();
      this.businessForm.get('street').enable();
      this.businessForm.get('area').enable();
      this.businessForm.get('city').enable();
      this.businessForm.get('state').enable();
      this.businessForm.get('pincode').enable();
    } else {
      this.isEditProfile = true;
      this.profileForm.get('name').enable();
      this.profileForm.get('dob').enable();
      this.profileForm.get('flat_no').enable();
      this.profileForm.get('street').enable();
      this.profileForm.get('area').enable();
      this.profileForm.get('city').enable();
      this.profileForm.get('pincode').enable();
      this.profileForm.get('state').enable();
      this.profileForm.get('country').enable();
      this.profileForm.get('about').enable();
      this.phoneForm.get('phone').enable();
      this.phoneForm.get('a_phone').enable();
    }
  }

  enablekycFields(){
      this.isKyc = true
      this.kycForm.get('upi_id').enable();
      this.kycForm.get('pan_card_no').enable();
      this.kycForm.get('bank_account_holder_name').enable();
      this.kycForm.get('bank_account_no').enable();
      this.kycForm.get('bank_ifsc_code').enable();
      this.kycForm.get('pan_card_photo').enable();
      this.kycForm.get('bank_passbook_photo').enable();
  }


  uploadItemImage(event: any, type : any): void {
    if (type == 'passbook') {      
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => { // called once readAsDataURL is completed
          // this.isUpload = true;
          this.passbookImage = event?.target?.result;
          const itemImageFormControl = this.kycForm.get('bank_passbook_photo');
          itemImageFormControl.setValue(file);
          // this.toastr.clear();
          // this.toastr.success("Image uploaded successfully.", 'Success');
        }
      }
    } else if (type == 'pan_card' ) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => { // called once readAsDataURL is completed
          // this.isUpload = true;
          this.panImage = event?.target?.result;
          const itemImageFormControl1 = this.kycForm.get('pan_card_photo');
          itemImageFormControl1.setValue(file);
          // this.toastr.clear();
          // this.toastr.success("Image uploaded successfully.", 'Success');
        }
      }
    }
  }
  private _prepareProfileForm(personalProfileObj: any = {}): void {
    const preparedDOB: any = moment(personalProfileObj?.dob, 'DD-MM-YYYY');

    this.profileForm = this._formBuilder.group({
      name: [{ value: personalProfileObj?.name, disabled: true }, [Validators.required]],
      email: [{ value: personalProfileObj?.email, disabled: true }, [Validators.required]],
      mobile: [{ value: personalProfileObj?.mobile, disabled: true }, [Validators.required]],
      dob: [{ value: (preparedDOB && preparedDOB._d && preparedDOB._d != 'Invalid Date') ? preparedDOB._d : null, disabled: true }, [Validators.required]],
      flat_no: [{ value: personalProfileObj?.flat_no || '', disabled: true }],
      street: [{ value: personalProfileObj?.street || '', disabled: true }],
      area: [{ value: personalProfileObj?.area || '', disabled: true }],
      city: [{ value: personalProfileObj?.city, disabled: true }, [Validators.required]],
      pincode: [{ value: personalProfileObj?.pincode, disabled: true }, [Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\.?[0-9]+)?$')]],
      state: [{ value: personalProfileObj?.state, disabled: true }, [Validators.required]],
      country: [{ value: personalProfileObj?.country, disabled: true }, [Validators.required]],
      country_code: [{ value: personalProfileObj?.country_code, disabled: true }],
      about: [{ value: personalProfileObj?.about || '', disabled: true }],
      alt_mobile_no: [{value: personalProfileObj?.alt_mobile_no || '', disabled: true }, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],           
      alt_dial_code: [{ value: personalProfileObj?.alt_dial_code || '', disabled: true }, [Validators.required]],       
    });
  }

  private _prepareBusinessForm(businessProfileObj: any = {}): void {
    
    this.businessForm = this._formBuilder.group({
      name: [{ value: businessProfileObj?.name || '', disabled: true }, [Validators.minLength(2)]],
      mobile: [{ value: businessProfileObj?.mobile || '', disabled: true }],
      email: [{ value: businessProfileObj?.email || '', disabled: true }, [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      country: [{ value: businessProfileObj?.country || '', disabled: true }, [Validators.required]],
      country_code: [{ value: businessProfileObj?.country_code || '', disabled: true }],
      flat_no: [{ value: businessProfileObj?.flat_no || '', disabled: true }],
      street: [{ value: businessProfileObj?.street || '', disabled: true }],
      area: [{ value: businessProfileObj?.area || '', disabled: true }],
      city: [{ value: businessProfileObj?.city || '', disabled: true }, [Validators.required]],
      state: [{ value: businessProfileObj?.state || '', disabled: true }, [Validators.required]],
      pincode: [{ value: businessProfileObj?.pincode || '', disabled: true }, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      about: [{ value: businessProfileObj?.about || '', disabled: true }],
      photos: [this.photoArr || []],
      videos: [this.videoArr || []],
    });
  }
  private _prepareKycForm(kycObj: any = {}): void {
    this.panImage = CONSTANTS.baseImageURL + kycObj.pan_card_photo;
    this.passbookImage = CONSTANTS.baseImageURL+ kycObj.bank_passbook_photo;
    this.kycForm = this._formBuilder.group({
      upi_id: [{ value: kycObj?.upi_id || '', disabled: true }, [Validators.email]],
      pan_card_no: [{ value: kycObj?.pan_card_no ||'', disabled: true }, [Validators.required,Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]$')]],
      bank_account_holder_name: [{ value: kycObj?.bank_account_holder_name || '', disabled: true }, [Validators.required]],
      bank_account_no: [{ value: kycObj?.bank_account_no || '', disabled: true }, [Validators.required,Validators.minLength(8),Validators.maxLength(14)]],
      bank_ifsc_code: [{ value: kycObj?.bank_ifsc_code || '', disabled: true }, [Validators.required,Validators.pattern('^[A-Za-z]{4}[0]{1}[A-Za-z0-9]{6}$')]],
      pan_card_photo: [{ value: kycObj?.pan_card_photo || '', disabled: true }, [Validators.required]],
      bank_passbook_photo: [{ value: kycObj?.bank_passbook_photo || '', disabled: true }, [Validators.required]]
    });
  }
}
