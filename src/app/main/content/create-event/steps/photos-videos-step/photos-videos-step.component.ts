import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {ModalService} from 'src/app/main/_modal';
import {SnotifyService} from "ng-snotify";
import {CONSTANTS} from "../../../../common/constants";

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
  photosForm: any;
  videoForm: any;

  posterObj: any;
  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];
  permissionObj: any = [];

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit(): void {
    this.photosAndVideosForm = this._formBuilder.group({
      poster: [null, [Validators.required]],
      photo: [null, [Validators.required]],
      video: [null, [Validators.required]],
    });

    this.photosForm = this._formBuilder.group({
      image: [null, [Validators.required]],
      details: [null]
    });

    this.videoForm = this._formBuilder.group({
      video: [null, [Validators.required]],
      details: [null]
    });

    $('.poster').dropify({
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    });

  }

  async onFileChange(event: any, imageFor: string, key = 0) {
    if (event) {
      this.imgChangeEvt = event;
      switch (imageFor) {
        case 'poster':
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.posterObj = file;
            this._modalService.open("imgCropper");
          }
          break;
        case 'photo':
          this.photosNgForm.resetForm();
          if (this.photoArr && this.photoArr.length && this.photoArr.length >= 5) {
            this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
          } else {
            this._modalService.open("photo");
          }
          // if (event.target && event.target.files && event.target.files.length > 0) {
          //   for (let i = 0; i < event.target.files.length; i++) {
          //     const file = event.target.files[i];
          //     // this.photoObj[key] = file;
          //     this.photoObj[i] = file;
          //   }
          //   this._modalService.open("photo");
          // }
          break;
        case 'video':
          this.photosNgForm.resetForm();

          if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
            this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
          } else {
            this._modalService.open("video");
          }
          // if (event.target.files.length > 0) {
          //   const file = event.target.files[0];
          //   this.videoObj[key] = file;
          // }
          break;
        case 'permission':
          const file = event.target.files[0];
          this.permissionObj = file;
          break;
      }
    }
  }

  savePoster(img: any) {
    this.posterObj = img;
    // console.log($('#posterUpload').find('.dropify-render').find('.dropify-render').find('img'));
    $('#posterUpload').find('.dropify-preview').find('.dropify-render').find('img').attr("src", img);

    this._modalService.close("imgCropper");
  }

  cropImg(e: ImageCroppedEvent) {
    let blob = e.base64;
    this.cropImgPreview = blob;
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
        this._modalService.close("photo");
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoArr.push({image: e.target.result, details: this.photosForm.value.details});
      };
      reader.readAsDataURL(image);
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
        this.videoArr.push({video: e.target.result, details: this.videoForm.value.details});
      };
      reader.readAsDataURL(video);
      this._modalService.close("video");
    }
  }

  removeImage(index: number) {
    this.photoArr.splice(index, 1);
  }

  removeVideo(index: number) {
    this.videoArr.splice(index, 1);
  }

}
