import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalService } from 'src/app/main/_modal';
import { SnotifyService } from "ng-snotify";
import { CONSTANTS } from "../../../../common/constants";
import { Router } from '@angular/router';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-photos-videos-step',
  templateUrl: './photos-videos-step.component.html',
  styleUrls: ['./photos-videos-step.component.scss']
})
export class PhotosVideosStepComponent implements OnInit {
  @ViewChild('photosNgForm') photosNgForm: any;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  photosAndVideosForm: any;
  photoForm: any;
  videoForm: any;

  posterObj: any = {};
  photoArr: any = [];
  videoArr: any = [];
  permissionObj: any = [];
  allPhotosFilesArr: any = [];
  allVideosFilesArr: any = [];

  editPhotoObj: any;
  imagesAndVideoObj: any = { photos_and_videos: {} };
  inputText: any;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router
  ) { }

  ngOnInit(): void {
    $('.poster').dropify({
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    });

    if (localStorage.getItem('eId')) {
      if (this.eventObj?.photos_and_videos?.poster) {
        const newPosterObj: any = {};
        newPosterObj.image = this.eventObj?.photos_and_videos?.poster;
        newPosterObj.name = this.eventObj?.photos_and_videos?.poster.name;
        this.posterObj = newPosterObj;
      }
      this.photoArr = this.eventObj?.photos_and_videos?.photos || [];
      this.videoArr = this.eventObj?.photos_and_videos?.videos || [];
      this.prepareDefaultImagesAndPosterAndVideos();
    } else {
      this._router.navigate(['/events']);
    }

    this.photosAndVideosForm = this._formBuilder.group({
      poster: [null],
      photo: [this.photoArr],
      video: [this.videoArr],
    });

    this.photoForm = this._formBuilder.group({
      image: [null],
      imageName: [''],
      details: [null]
    });

    this.videoForm = this._formBuilder.group({
      video: [null],
      videoName: [null],
      details: [null]
    });
    // this.preImg = this.imagesAndVideoObj?.photos_and_videos?.photo[0].image.split(',', 2)[1]
    // this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.preImg}`);
    // console.log(this.imagesAndVideoObj?.photos_and_videos?.photo);
  }

  prepareDefaultImagesAndPosterAndVideos(): void {
    if (this.posterObj && this.posterObj.image) {
      if (typeof(this.posterObj.image) == 'string') {
        this.savePoster(this.posterObj);
      } else {
        const image: any = this.posterObj.image;
        if (image != undefined) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.cropImgPreview = e.target.result;
          };
          reader.readAsDataURL(image);
        }
      }
    }
    _.each(this.photoArr, (photoObj: any) => {
      if (typeof(photoObj.image) != 'string') {
        const image: any = photoObj.image;
        if (image != undefined) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            photoObj.image = e.target.result;
          };
          reader.readAsDataURL(image);
          this.allPhotosFilesArr.push({ image: image, details: photoObj?.details, name: photoObj?.name });
        }
      }
    });
    _.each(this.videoArr, (videoObj: any) => {
      if (typeof(videoObj.video) != 'string') {
        const video: any = videoObj.video;
        if (video != undefined) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            videoObj.video = e.target.result;
          };
          reader.readAsDataURL(video);
          this.allVideosFilesArr.push({ video: video, details: videoObj?.details });
        }
      }
    });
  }

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  readURL(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  async onFileChange(event: any, imageFor: string, key = 0) {
    if (event) {
      this.imgChangeEvt = event;
      switch (imageFor) {
        case 'poster':
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.posterObj.image = file;
            this.posterObj.name = file.name;
            this._modalService.open("imgCropper");
          }
          break;
        case 'photo':
          this.photosNgForm.resetForm();
          if (this.editPhotoObj) {
            if (this.editPhotoObj.image) {
              this.editPhotoObj.image = '';
            }
            if (this.editPhotoObj.details) {
              this.editPhotoObj.details = '';
            }
            if (this.editPhotoObj.name) {
              this.editPhotoObj.name = '';
            }
          }
          if (this.photoArr && this.photoArr.length && this.photoArr.length >= 15) {
            this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
          } else {
            this._modalService.open("photo");
          }
          break;
        case 'video':
          this.photosNgForm.resetForm();

          if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
            this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
          } else {
            this._modalService.open("video");
          }
          break;
        case 'permission':
          const file = event.target.files[0];
          this.permissionObj = file;
          break;
      }
    }
  }

  savePoster(img: any) {
    this.posterObj.image = img;
    // console.log($('#posterUpload').find('.dropify-render').find('.dropify-render').find('img'));
    $('#posterUpload').find('.dropify-preview').find('.dropify-render').find('img').attr("src", img);

    this._modalService.close("imgCropper");
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
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

      if (this.photoArr && this.photoArr.length && this.photoArr.length >= 15) {
        this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
        this._modalService.close("photo");
        return false;
      }

      this.photoForm.get('imageName').setValue(image.name);
      const photosFormValues: any = this.photoForm.value;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoArr.push({ image: e.target.result, details: photosFormValues?.details, name: photosFormValues?.imageName });
      };
      reader.readAsDataURL(image);
      this.allPhotosFilesArr.push({ image: image, details: photosFormValues?.details, name: photosFormValues?.imageName });
      $('#create-photo-upload').val(null);
      this.inputText = '';
      this._modalService.close("photo");
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
        this._modalService.close("video");
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoArr.push({ video: e.target.result, details: this.videoForm.value.details });
      };
      reader.readAsDataURL(video);
      const videoFormValues: any = this.videoForm.value;
      this.allVideosFilesArr.push({ video: video, details: videoFormValues?.details });
      $('#create-video-upload').val(null);
      this.inputText = '';
      this._modalService.close("video");
    }
  }

  removeImage(index: number) {
    this.photoArr.splice(index, 1);
    this.allPhotosFilesArr.splice(index, 1);
  }

  removeVideo(index: number) {
    this.videoArr.splice(index, 1);
    this.allVideosFilesArr.splice(index, 1);
  }

  nextStep() {
    this.eventObj.photos_and_videos = this.prepareObj();
    this.newEventObj.emit(this.eventObj);
    this._router.navigate(['/events/create/permission']);
  }

  prepareObj(): any {
    let posterObj: any = {};
    if (this.posterObj && this.posterObj.image && typeof (this.posterObj.image) == 'string') {
      posterObj = this._globalFunctions.base64ToImage(this.posterObj.image, this.posterObj.name);
    } else {
      posterObj = this.posterObj.image;
    }
    const preparedObj: any = {};
    preparedObj.poster = posterObj;
    preparedObj.photos = this.allPhotosFilesArr;
    preparedObj.videos = this.allVideosFilesArr;
    return preparedObj;
  }

}
