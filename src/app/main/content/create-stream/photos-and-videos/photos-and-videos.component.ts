import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateStreamService } from '../create-stream.service';
import { ModalService } from 'src/app/main/_modal';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { forkJoin, Observable, switchMap, take } from 'rxjs';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-photos-and-videos',
  templateUrl: './photos-and-videos.component.html',
  styleUrls: ['./photos-and-videos.component.scss']
})
export class PhotosAndVideosComponent implements OnInit {
  @ViewChild('photosNgForm') photosNgForm: any;
  @ViewChild('videosNgForm') videosNgForm: any;
  @ViewChild('photoEditForm') photoEditForm: any;
  @ViewChild('videoEditForm') videoEditForm: any;

  constants: any = CONSTANTS;
  liveStreamId: any = '';
  deleteItemObj: any = {};
  
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  photoForm: any;
  videoForm: any;
  photoUpdateForm: any;
  videoUpdateForm: any;
  posterObj: any = {};
  dropifyOption: any = {};
  dropifyEditOption: any = {};
  dropifyVideoEditOption: any = {};
  editPhotoObj: any = {};
  editVideoObj: any = {};
  isCropperLoading: boolean = false;
  isPosterLoading: boolean = false;
  isPhotoLoading: boolean = false;
  isEditMode: boolean = false;
  drEvent: any;
  editDrEvent: any;
  editVideoDrEvent: any;
  bannerUrl: any = '';
  
  photoArr: any = [];  
  videoArr: any = [];

  isOpenPopup: boolean = false;
  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];

  isLoading: boolean = false;
  isImgLoading: boolean = false;
  isVideoLoading: boolean = false;
  isDeleteLoading: boolean = false;

  photosUploadLimit: number = 15;
  rejectedPhotosList: any;
  imagesFiles: File[] = [];
  videosUploadLimit: number = 2;
  rejectedVideosList: any;
  videosFiles: File[] = [];
  descriptionLimit: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _createStreamService: CreateStreamService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _compressImage: CompressImageService
  ) { }

  ngOnInit(): void {
    this.dropifyOption = {
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
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
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    this.editDrEvent = $('.editPoster').dropify(this.dropifyEditOption);
    this.editVideoDrEvent = $('.editVideo').dropify(this.dropifyVideoEditOption);
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.isEditMode = true;
      this.getLiveStreamMediaById(this.liveStreamId);
    }

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

  getLiveStreamMediaById(liveStreamId: any = ''): void {
    this.isLoading = true;
    this._createStreamService.getLiveStreamMediaById(liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const liveStreamMediaObj: any = result?.Data || {};
        if (result?.Data?.banner) {
          this.setPosterInDropify(result?.Data?.banner);
        }
        if (liveStreamMediaObj.photos && liveStreamMediaObj.photos.length) {
          this.photoArr = this._globalFunctions.copyObject(liveStreamMediaObj.photos);
        }
        if (liveStreamMediaObj.videos && liveStreamMediaObj.videos.length) {
          this.videoArr = this._globalFunctions.copyObject(liveStreamMediaObj.videos);
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

  // Poster
  isString(val: any): boolean {
    return typeof val === 'string';
  }

  onPosterChange(event: any): any {
    this.imgChangeEvt = event;
    if (event.target.files.length > 0) {
      const poster = event.target.files[0];
      if (poster != undefined) {
        if (poster.type != 'image/jpeg' && poster.type != 'image/jpg' && poster.type != 'image/png' && poster.type != 'image/gif' && poster.type != 'image/avif' && poster.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return false;
        }

        const image_size = poster.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxPosterSizeInMB) {
          this._sNotify.error('Maximum Poster Size is ' + CONSTANTS.maxPosterSizeInMB + 'MB.', 'Oops!');
          return false;
        }
        this.posterObj.image = poster;
        this.posterObj.name = poster.name;
        this.savePoster(poster);

        // this._modalService.open("imgCropper");
        // this.isCropperLoading = true;
      }
    }
  }

  savePoster(img: any) {
    if (img && img != '' && !this.isPosterLoading) {
      // const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      // this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (img) {
          const posterFormData = new FormData();
          posterFormData.append('file', img);
          this.isPosterLoading = true;
          this._createStreamService.uploadBanner(posterFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.posterObj.image = img;
              this.setPosterInDropify(result.Data.url);
              // this.inputText = _.last(_.split(result.Data.url, '/'));
              this._sNotify.success('File Uploaded Successfully.', 'Success');
              this.isPosterLoading = false;
              this._modalService.close("imgCropper");
            } else {
              this._globalFunctions.successErrorHandling(result, this, true);
              this.isPosterLoading = false;
            }
          }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
            this.isPosterLoading = false;
          });
        } else {
          this._sNotify.success('Something went wrong!', 'Oops');
        }
      // });
    }
  }

  openUploadPhotoDialog(): void {
    this.descriptionLimit = 0;
    this.photosNgForm.resetForm();
    if (this.photoArr && this.photoArr.length && this.photoArr.length >= this.photosUploadLimit) {
      this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
    } else {
      this._modalService.open('photo');
    }
  }

  openUploadVideoDialog(): void {
    this.descriptionLimit = 0;
    this.videosNgForm.resetForm();
    if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
      this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
    } else {
      this._modalService.open('video');
    }
  }

  setPosterInDropify(image: any = ''): void {
    const imageUrl = CONSTANTS.baseImageURL + image;
    this.drEvent = this.drEvent.data('dropify');
    this.drEvent.resetPreview();
    this.drEvent.clearElement();
    this.drEvent.settings.defaultFile = imageUrl;
    this.drEvent.destroy();
    this.drEvent.init();

    this.dropifyOption.defaultFile = imageUrl;
    this.drEvent = $('.poster').dropify(this.dropifyOption);
    this.bannerUrl = image;
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  imageLoaded(): void {
    this.isCropperLoading = false;
  }

  popClose(popId: any): any {
    // let drEvent: any = $('.poster').dropify();
    // drEvent = drEvent.data('dropify');
    // drEvent.resetPreview();
    // drEvent.clearElement();
    $('.dropify-clear').click();
    this._modalService.close(popId);
  }

  // Upload Images  
  uploadImage(): any {
    if (this.descriptionLimit > CONSTANTS.CKEditorCharacterLimit0) {
      return false;
    }

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
        this.isPhotoLoading = true;
        responseObj.push(this._createStreamService.uploadImages(photoFormData));
      }
    });

    forkJoin(...responseObj).subscribe((resultArr: any) => {
      _.each(resultArr, (result: any) => {
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
            this.isImgLoading = false;
          }
      });
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

  onEditPosterChange(event: any): any {
    this.imgChangeEvt = event;
    if (event.target.files.length > 0) {
      const poster = event.target.files[0];
      if (poster != undefined) {
        if (poster.type != 'image/jpeg' && poster.type != 'image/jpg' && poster.type != 'image/png' && poster.type != 'image/gif' && poster.type != 'image/avif' && poster.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return false;
        }

        const image_size = poster.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxPosterSizeInMB) {
          this._sNotify.error('Maximum Poster Size is ' + CONSTANTS.maxPosterSizeInMB + 'MB.', 'Oops!');
          return false;
        }
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
      this.savePhotosVideo();
    } else {
      if (this.photoUpdateForm.value.image !== null) {
        const photoFormData = new FormData();
        photoFormData.append('file', this.photoUpdateForm.value.image);
        this.isPhotoLoading = true;
        this._createStreamService.uploadImages(photoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.photoArr[this.editPhotoObj.index].url = result.Data.url;
            this.photoArr[this.editPhotoObj.index].description = this.photoUpdateForm.value.description;
            this._sNotify.success('File Uploaded Successfully.', 'Success');
            this.isPhotoLoading = false;
            this._modalService.close("photoEdit");
            this.savePhotosVideo()
          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isPosterLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isPosterLoading = false;
        });
      } else {
        this._sNotify.success('Something went wrong!', 'Oops');
      }
    }
  }
  removeImage(index: number) {
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
        responseObj.push(this._createStreamService.uploadVideos(videoFormData));
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
  removeVideo(index: number) {
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
    this.isDeleteLoading = false;
    this.savePhotosVideo();
    this.close();
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

        const image_size = video.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxVideoSizeInMB) {
          this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
          return false;
        }
        this.videoUpdateForm.controls['video'].setValue(video);
      }
    }
  }

  editUploadVideo(): any {
    if (this.videoUpdateForm.value.video === null) {
      this.videoArr[this.editVideoObj.index].description = this.videoUpdateForm.value.description;
      this._modalService.close('videoEdit');
      this.savePhotosVideo();
    } else {
      if (this.videoUpdateForm.value.video !== null) {
        const videoFormData = new FormData();
        videoFormData.append('file', this.videoUpdateForm.value.video);
        this.isVideoLoading = true;
        this._createStreamService.uploadVideos(videoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.videoArr[this.editVideoObj.index].url = result.Data.url;
            this.videoArr[this.editVideoObj.index].description = this.videoUpdateForm.value.description;
            this._sNotify.success('File Uploaded Successfully.', 'Success');
            this.isVideoLoading = false;
            this._modalService.close("videoEdit");
            this.savePhotosVideo()
          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isPosterLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isPosterLoading = false;
        });
      } else {
        this._sNotify.success('Something went wrong!', 'Oops');
      }
    }
  }

  savePhotosVideo() {
    const preparedPhotosAndVideosObj: any = this.preparePhotosAndVideosObj();
    this._createStreamService.saveLiveStreamMedia(preparedPhotosAndVideosObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this._sNotify.success('Image Updated Successfully.', 'Success');
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  validatePhotosAndVideosObj(): any {
    if (!this.bannerUrl || this.bannerUrl == '') {
      this._sNotify.error('Banner is required', 'Oops!');
      return false;
    }
    if (!this.photoArr || !this.photoArr.length) {
      this._sNotify.error('At least one photo required', 'Oops!');
      return false;
    }
    if (!this.videoArr || !this.videoArr.length) {
      this._sNotify.error('At least one video required', 'Oops!');
      return false;
    }
    return true;
  }

  preparePhotosAndVideosObj(): any {
    const preparedPhotosAndVideosObj: any = {};
    preparedPhotosAndVideosObj.livestreamid = this.liveStreamId;
    preparedPhotosAndVideosObj.banner = this._globalFunctions.copyObject(this.bannerUrl);
    preparedPhotosAndVideosObj.photos = this._globalFunctions.copyObject(this.photoArr);
    preparedPhotosAndVideosObj.videos = this._globalFunctions.copyObject(this.videoArr);
    return preparedPhotosAndVideosObj;
  }

  nextStep(): any {
    if (this.isLoading || !this.validatePhotosAndVideosObj() || (this.bannerUrl == '')) {
      return false;
    }
    this.isLoading = true;
    const preparedPhotosAndVideosObj: any = this.preparePhotosAndVideosObj();
    this._createStreamService.saveLiveStreamMedia(preparedPhotosAndVideosObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this._router.navigate(['/live-stream/create/company-details']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

}
