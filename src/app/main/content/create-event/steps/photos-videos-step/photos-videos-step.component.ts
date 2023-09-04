import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateEventService } from '../../create-event.service';
import { CONSTANTS } from "../../../../common/constants";
import { ModalService } from 'src/app/main/_modal';
import { SnotifyService } from "ng-snotify";
import { Router } from '@angular/router';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { forkJoin, merge, Observable, take } from 'rxjs';
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
  @ViewChild('photoEditForm') photoEditForm: any;

  constants: any = CONSTANTS;
  eventId: any = '';
  posterImageAndVideoObj: any = {};
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  photoForm: any;
  videoForm: any;
  photoUpdateForm: any;
  isLoading: boolean = false;
  isPosterLoading: boolean = false;
  isPhotoLoading: boolean = false;
  isVideoLoading: boolean = false;
  isCropperLoading: boolean = false;
  isDeleteLoading: boolean = false;
  isOpenEditImageModal: boolean = false;
  deleteItemObj: any = {};

  posterObj: any = {};
  dropifyOption: any = {};
  dropifyEditOption: any = {};
  editPhotoObj: any = {};
  imagesAndVideoObj: any = { photos_and_videos: {} };
  inputText: any;
  drEvent: any;
  editDrEvent: any;
  photosUploadLimit: number = 15;
  rejectedPhotosList: any;
  imagesFiles: File[] = [];
  videosUploadLimit: number = 2;
  rejectedVideosList: any;
  videosFiles: File[] = [];
  descriptionLimit: any = 0;

  isOpenPopup: boolean = false;
  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];
 

  openImages:boolean=false;
  viewImagesDailog:any;
  viewEqpImagesDailog:any;

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _createEventService: CreateEventService,
    private _router: Router,
    private _compressImage: CompressImageService
  ) {
  }

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
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    this.drEvent.on('dropify.afterClear', (event: any, element: any) => {
      this.posterImageAndVideoObj.banner = '';
    });
    this.editDrEvent = $('.editPoster').dropify(this.dropifyEditOption);
    if (localStorage.getItem('eId')) {
      this.eventId = localStorage.getItem('eId');
      this.posterImageAndVideoObj = { eventid: this.eventId, banner: '', photos: [], videos: [] };
      this.getPhotosAndVideos();
    } else {
      this._router.navigate(['/events']);
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
        // poster
        // this._modalService.open("imgCropper");
        // this.isCropperLoading = true;
        
      }
    }
  }
  savePoster(compressedImage: any) {
    if (compressedImage && compressedImage != '' && !this.isPosterLoading) {
      // const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      // this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (compressedImage) {
          const posterFormData = new FormData();
          posterFormData.append('file', compressedImage);
          this.isPosterLoading = true;
          this._createEventService.uploadBanner(posterFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.posterObj.image = compressedImage;
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
    if (this.posterImageAndVideoObj.photos && this.posterImageAndVideoObj.photos.length && this.posterImageAndVideoObj.photos.length >= this.photosUploadLimit) {
      this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
    } else {
      this._modalService.open('photo');
    }
  }

  openUploadVideoDialog(): void {
    this.descriptionLimit = 0;
    this.videosNgForm.resetForm();
    if (this.posterImageAndVideoObj.videos && this.posterImageAndVideoObj.videos.length && this.posterImageAndVideoObj.videos.length >= 2) {
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
    this.posterImageAndVideoObj.banner = image;
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  imageLoaded(): void {
    this.isCropperLoading = false;
  }

  popClose(popId: any): any {
    $('.dropify-clear').click();
    this._modalService.close(popId);
  }

  // Images Upload
  uploadImage(): any {
    if (this.descriptionLimit > CONSTANTS.CKEditorCharacterLimit0) {
      return false;
    }

    const responseObj: Observable<any>[] = [];
      console.log(responseObj);
      
    this.imagesFiles.forEach((image: any) => {
      if (image != undefined) {
        if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png' && image.type != 'image/gif' && image.type != 'image/avif' && image.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return;
        }

        const image_size = image.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxImageSizeInMB) {
          this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
          return;
        }

        if (this.posterImageAndVideoObj.photos && this.posterImageAndVideoObj.photos.length && this.posterImageAndVideoObj.photos.length >= this.photosUploadLimit) {
          this._sNotify.error('Maximum 15 images can upload!', 'Oops!');
          this._modalService.close("photo");
          return;
        }

        const photoFormData = new FormData();
        photoFormData.append('file', image);
        this.isPhotoLoading = true;
        responseObj.push(this._createEventService.uploadImages(photoFormData));
      }
    });

    forkJoin(...responseObj).subscribe((resultArr: any) => {
      _.each(resultArr, (result: any) => {
        if (result && result.IsSuccess) {
          this.posterImageAndVideoObj.photos.push({ url: result.Data.url, description: this.photoForm.value?.description });
          this.photoForm.get('description').setValue('');
          this._sNotify.success('Image Uploaded Successfully.', 'Success');
          this.imagesFiles = [];
          this.isPhotoLoading = false;
          // this.inputText = '';
          this.descriptionLimit = 0;
          this._modalService.close('photo');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isPhotoLoading = false;
        }
      });
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isPhotoLoading = false;
    });
  }

  // Images Upload for Edit & Check image exist & new
  editUploadImage(): any {
      //console.log(this.editPhotoObj);
      //console.log(this.photoUpdateForm.value);
      if (this.photoUpdateForm.value.image === null) {
        //console.log('Empty New File Attachment');
        this.posterImageAndVideoObj.photos[this.editPhotoObj.index].description = this.photoUpdateForm.value.description;
        this._modalService.close('photoEdit');
        this.savePhotosVideo();
      } else {
        if (this.photoUpdateForm.value.image !== null) {
          //console.log('Ready For Upload New File');
          const photoFormData = new FormData();
          photoFormData.append('file', this.photoUpdateForm.value.image);
          this.isPhotoLoading = true;
          this._createEventService.uploadImages(photoFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              //console.log(result);
              this.posterImageAndVideoObj.photos[this.editPhotoObj.index].url = result.Data.url;
              this.posterImageAndVideoObj.photos[this.editPhotoObj.index].description = this.photoUpdateForm.value.description;
              //this.posterObj.image = compressedImage;
              //this.setPosterInDropify(result.Data.url);
              // this.inputText = _.last(_.split(result.Data.url, '/'));
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

  onSelectImages(event: any) {
    const totalPhotos = this.photosUploadLimit - ((this.posterImageAndVideoObj?.photos?.length || 0) + (event?.addedFiles?.length || 0) + (this.imagesFiles?.length || 0));
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
    this.deleteItemObj = { index: index, type: 'photo' };
    this._modalService.open("delete-event-pop");
    // this.posterImageAndVideoObj.photos.splice(index: index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
  }

  uploadVideo(): any {
    if (this.descriptionLimit > CONSTANTS.CKEditorCharacterLimit0) {
      return false;
    }

    const responseObj: Observable<any>[] = [];
    this.videosFiles.forEach((video: any) => {
      if (video != undefined) {
        if (video.type != 'video/mp4' && video.type != 'video/mov' && video.type != 'video/wmv' && video.type != 'video/avi' && video.type != 'video/mkv' && video.type != 'video/flv' && video.type != 'video/f4v' && video.type != 'video/swf') {
          this._sNotify.error('Video type should only MP4, MOV, WMV, AVI, MKV, FLV, F4V and SWF', 'Oops!');
          return;
        }

        const video_size = video.size / 1024 / 1024;
        if (video_size > CONSTANTS.maxVideoSizeInMB) {
          this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxVideoSizeInMB + 'MB.', 'Oops!');
          return;
        }

        if (this.posterImageAndVideoObj.videos && this.posterImageAndVideoObj.videos.length && this.posterImageAndVideoObj.videos.length >= 2) {
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
          this.posterImageAndVideoObj.videos.push({ url: result.Data.url, description: this.videoForm.value?.description });
          this.videoForm.get('description').setValue('');
          this._sNotify.success('Video Uploaded Successfully.', 'Success');
          this.videosFiles = [];
          this.isVideoLoading = false;
          $('#create-video-upload').val(null);
          // this.inputText = '';
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
    const totalVideos = this.videosUploadLimit - ((this.posterImageAndVideoObj?.videos?.length || 0) + (event?.addedFiles?.length || 0) + (this.videosFiles?.length || 0));
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
    this.deleteItemObj = { index: index, type: 'video' };
    this._modalService.open("delete-event-pop");
  }

  viewImage(index:number){
    this.openImages = !this.openImages;
    this.viewImagesDailog = this.posterImageAndVideoObj.photos[index].url;    
    console.log(this.viewImagesDailog,index);
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
    //console.log(this.posterImageAndVideoObj);
    //console.log(this.posterImageAndVideoObj.photos[index]);
    this.editPhotoObj = { index: index, type: 'photo', data: this.posterImageAndVideoObj.photos[index]};
    //console.log(photo);
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

  savePhotosVideo() {
    this._createEventService.photosAndVideo(this.posterImageAndVideoObj).subscribe((result: any) => {
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
  async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

}

