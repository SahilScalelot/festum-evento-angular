import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateStreamService } from '../create-stream.service';
import { ModalService } from 'src/app/main/_modal';
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
  
  photoArr: any = [];  
  videoArr: any = [];

  isLoading: boolean = false;
  isImgLoading: boolean = false;
  isVideoLoading: boolean = false;
  isDeleteLoading: boolean = false;

  constructor(    
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _createStreamService: CreateStreamService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
  ) { }

  ngOnInit(): void {
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
      if (this.photoArr && this.photoArr.length && this.photoArr.length >= 15) {
        this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
        return false;
      }
      imgFormData.append('file', image);
      this.isImgLoading = true;
      this._createStreamService.uploadImages(imgFormData).subscribe((result: any) => {
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
      if (this.videoArr && this.videoArr.length && this.videoArr.length >= 2) {
        this._sNotify.error('Maximum 2 videos can upload!', 'Oops!');
        return false;
      }
      videoFormData.append('file', video);
      this.isVideoLoading = true;
      this._createStreamService.uploadVideos(videoFormData).subscribe((result: any) => {
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
    this.deleteItemObj = {index: index, type: 'photo'};
    this._modalService.open("delete-event-pop");
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
    preparedPhotosAndVideosObj.photos = this._globalFunctions.copyObject(this.photoArr);
    preparedPhotosAndVideosObj.videos = this._globalFunctions.copyObject(this.videoArr);
    return preparedPhotosAndVideosObj;
  }

  nextStep(): any {
    if (this.isLoading || !this.validatePhotosAndVideosObj()) {
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
