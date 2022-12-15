import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateEventService } from '../../create-event.service';
import { CONSTANTS } from "../../../../common/constants";
import { ModalService } from 'src/app/main/_modal';
import { SnotifyService } from "ng-snotify";
import { Router } from '@angular/router';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { take } from 'rxjs';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-photos-videos-step',
  templateUrl: './photos-videos-step.component.html',
  styleUrls: ['./photos-videos-step.component.scss']
})
export class PhotosVideosStepComponent implements OnInit {
  @ViewChild('photosNgForm') photosNgForm: any;
  @ViewChild('videosNgForm') videosNgForm: any;

  constants: any = CONSTANTS;
  eventId: any = '';
  posterImageAndVideoObj: any = {};
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  photoForm: any;
  videoForm: any;
  isLoading: boolean = false;
  isPosterLoading: boolean = false;
  isPhotoLoading: boolean = false;
  isVideoLoading: boolean = false;
  isCropperLoading: boolean = false;
  isDeleteLoading: boolean = false;
  deleteItemObj: any = {};

  posterObj: any = {};
  dropifyOption: any = {};
  editPhotoObj: any;
  imagesAndVideoObj: any = { photos_and_videos: {} };
  inputText: any;
  drEvent: any;

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _createEventService: CreateEventService,
    private _router: Router,
    private _compressImage: CompressImageService
  ) { }

  ngOnInit(): void {
    this.dropifyOption = {
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    this.drEvent.on('dropify.afterClear', (event: any, element: any) => {
      this.posterImageAndVideoObj.banner = '';
    });

    if (localStorage.getItem('eId')) {
      this.eventId = localStorage.getItem('eId');
      this.posterImageAndVideoObj = {eventid: this.eventId, banner: '', photos: [], videos: []};
      this.getPhotosAndVideos();
    } else {
      this._router.navigate(['/events']);
    }

    this.photoForm = this._formBuilder.group({
      image: [null],
      imageName: [''],
      description: [null]
    });

    this.videoForm = this._formBuilder.group({
      video: [null],
      videoName: [null],
      description: [null]
    });
  }

  getPhotosAndVideos(): void {
    this.isLoading = true;
    this._createEventService.getPhotosAndVideos(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.posterImageAndVideoObj.banner = result?.Data?.banner || '';
        this.posterImageAndVideoObj.photos = result?.Data?.photos || [];
        this.posterImageAndVideoObj.videos = result?.Data?.videos || [];
        if (this.posterImageAndVideoObj.banner) {
          this.setPosterInDropify(result?.Data?.banner);
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

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  readURL(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  onPosterChange(event: any): any {
    this.imgChangeEvt = event;
    if (event.target.files.length > 0) {
      const poster = event.target.files[0];
      if (poster != undefined) {
        if (poster.type != 'image/jpeg' && poster.type != 'image/jpg' && poster.type != 'image/png') {
          this._sNotify.error('Poster type is Invalid.', 'Oops!');
          return false;
        }

        const image_size = poster.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxPosterSizeInMB) {
          this._sNotify.error('Maximum Poster Size is ' + CONSTANTS.maxPosterSizeInMB + 'MB.', 'Oops!');
          return false;
        }
        this.posterObj.image = poster;
        this.posterObj.name = poster.name;
        this._modalService.open("imgCropper");
        this.isCropperLoading = true;
      }
    }
  }

  openUploadPhotoDialog(): void {
    this.photosNgForm.resetForm();
    if (this.posterImageAndVideoObj.photos && this.posterImageAndVideoObj.photos.length && this.posterImageAndVideoObj.photos.length >= 15) {
      this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
    } else {
      this._modalService.open('photo');
    }
  }

  openUploadVideoDialog(): void {
    this.videosNgForm.resetForm();
    if (this.posterImageAndVideoObj.videos && this.posterImageAndVideoObj.videos.length && this.posterImageAndVideoObj.videos.length >= 2) {
      this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
    } else {
      this._modalService.open('video');
    }
  }

  savePoster(img: any) {
    if (img && img != '' && !this.isPosterLoading) {
      const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (compressedImage) {
          const posterFormData = new FormData();
          posterFormData.append('file', compressedImage);
          this.isPosterLoading = true;
          this._createEventService.uploadBanner(posterFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.posterObj.image = img;
              this.setPosterInDropify(result.Data.url);
              this.inputText = _.last(_.split(result.Data.url, '/'));
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
      });
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
    this.posterImageAndVideoObj.banner = image;
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

  uploadImage(): any {
    let image = $('#create-photo-upload')[0].files[0];
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

      if (this.posterImageAndVideoObj.photos && this.posterImageAndVideoObj.photos.length && this.posterImageAndVideoObj.photos.length >= 15) {
        this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
        this._modalService.close("photo");
        return false;
      }

      if (!this.isPhotoLoading) {
        const photoFormData = new FormData();
        photoFormData.append('file', image);
        this.isPhotoLoading = true;
        this._createEventService.uploadImages(photoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.posterImageAndVideoObj.photos.push({url: result.Data.url, description: this.photoForm.value?.description});
            this._sNotify.success('Image Uploaded Successfully.', 'Success');
            this.isPhotoLoading = false;
            $('#create-photo-upload').val(null);
            this.inputText = '';
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

      if (this.posterImageAndVideoObj.videos && this.posterImageAndVideoObj.videos.length && this.posterImageAndVideoObj.videos.length >= 2) {
        this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
        this._modalService.close('video');
        return false;
      }

      if (!this.isVideoLoading) {
        const videoFormData = new FormData();
        videoFormData.append('file', video);
        this.isVideoLoading = true;
        this._createEventService.uploadVideos(videoFormData).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.posterImageAndVideoObj.videos.push({url: result.Data.url, description: this.videoForm.value?.description});
            this._sNotify.success('Video Uploaded Successfully.', 'Success');
            this.isVideoLoading = false;
            $('#create-video-upload').val(null);
            this.inputText = '';
            this._modalService.close('video');
          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isVideoLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isVideoLoading = false;
        });
      }
    }
  }

  removeImage(index: number) {
    this.deleteItemObj = {index: index, type: 'photo'};
    this._modalService.open("delete-event-pop");
    // this.posterImageAndVideoObj.photos.splice(index: index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
  }

  removeVideo(index: number) {
    this.deleteItemObj = {index: index, type: 'video'};
    this._modalService.open("delete-event-pop");
    // this.posterImageAndVideoObj.videos.splice(index, 1);
    // this.allVideosFilesArr.splice(index, 1);
  }

  nextStep() {
    this.isLoading = true;
    this._createEventService.photosAndVideo(this.posterImageAndVideoObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this._router.navigate(['/events/create/permission']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }
  
  close(): void {
    this.deleteItemObj = {};
    this._modalService.close("delete-event-pop");
  }

  deleteEvent(): void {
    this.isDeleteLoading = true;
    this.posterImageAndVideoObj[this.deleteItemObj.type + 's'].splice(this.deleteItemObj.index, 1);
    this.isDeleteLoading = false;
    this.close();
  }

}
