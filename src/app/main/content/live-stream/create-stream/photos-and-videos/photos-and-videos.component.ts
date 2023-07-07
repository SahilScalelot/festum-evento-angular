import { Component, OnInit } from '@angular/core';
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
  constants: any = CONSTANTS;
  liveStreamId: any = '';
  deleteItemObj: any = {};
  
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  posterObj: any = {};
  dropifyOption: any = {};
  isCropperLoading: boolean = false;
  isPosterLoading: boolean = false;
  drEvent: any;
  bannerUrl: any = '';
  
  photoArr: any = [];  
  videoArr: any = [];

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
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    
    this.liveStreamId = localStorage.getItem('lsId');
    if (this.liveStreamId && this.liveStreamId != '') {
      this.getLiveStreamMediaById(this.liveStreamId);
    }
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
        this._modalService.open("imgCropper");
        this.isCropperLoading = true;
      }
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
        responseObj.push(this._createStreamService.uploadImages(photoFormData));
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
    this.close();
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
