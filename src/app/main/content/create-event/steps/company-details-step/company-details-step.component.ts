import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from '../../create-event.service';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-company-details-step',
  templateUrl: './company-details-step.component.html',
  styleUrls: ['./company-details-step.component.scss']
})

export class CompanyDetailsStepComponent implements OnInit {
  imgChangeEvt: any = '';

  isLoading: boolean = false;
  isPdfLoading: boolean = false;
  constants: any = CONSTANTS;

  companyForm: any;
  inputText: any;


  pdfObj: any = [];
  photoArr: any = [];
  photoObj: any = [];
  videoObj: any = [];
  videoArr: any = [];

  eventId: any;
  personalDetailsObj: any = {};
  gstPdf: any;
  
  allPhotosFilesArr: any = [];
  allVideosFilesArr: any = [];

  isInValidPDF: boolean = false;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _createEventService: CreateEventService,
    private _globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    
    // if (localStorage.getItem('eId')) {
    //   this.photoArr = this.eventObj?.company_details?.company_images || [];
    //   this.videoArr = this.eventObj?.company_details?.company_videos || [];
    //   this.prepareObj();
    // } else {
    //   this._router.navigate(['/events']);
    // }
    this._prepareAboutEventForm(this.eventObj);
  }

  private _prepareAboutEventForm(eventObj: any = {}): void {
    this.companyForm = this._formBuilder.group({
      name: [eventObj?.company_details?.company_detail?.name, [Validators.minLength(2)]],
      gst: [''],
      contact_no: [eventObj?.company_details?.company_detail?.contact_no, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [eventObj?.company_details?.company_detail?.email, [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about: [eventObj?.company_details?.company_detail?.about, [Validators.required]],
      flat_no: [eventObj?.company_details?.company_detail?.flat_no],
      street: [eventObj?.company_details?.company_detail?.street],
      area: [eventObj?.company_details?.company_detail?.area],
      city: [eventObj?.company_details?.company_detail?.city, [Validators.required]],
      state: [eventObj?.company_details?.company_detail?.state, [Validators.required]],
      pincode: [eventObj?.company_details?.company_detail?.pincode, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      photos: [this.photoArr],
      videos: [this.videoArr],

      // "photos" : [
      //     {
      //         "url" : "637477038e96c599daafa8f0/event/IMG/IMG-758333552065751.jpeg"
      //     }, 
      //     {
      //         "url" : "637477038e96c599daafa8f0/event/IMG/IMG-3013547270526469.jpeg"
      //     }
      // ],
      // "videos" : [
      //     {
      //         "url" : "637477038e96c599daafa8f0/event/VID/VID-16738184478292295.mp4"
      //     },
      //     {
      //        "url" : "637477038e96c599daafa8f0/event/VID/VID-7058096398714531.mp4"
      //     }
      // ]
    });

    this.inputText = eventObj?.company_details?.company_detail?.gst_name;
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

      if (this.photoArr && this.photoArr.length && this.photoArr.length >= 5) {
        this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoArr.push({ image: e.target.result });
      };
      reader.readAsDataURL(image);
      this.allPhotosFilesArr.push({ image: image });
      $('#create-photo-upload').val(null);
    }
    
    imgFormData.append('file', image);
    this.isPdfLoading = true;
    this._createEventService.uploadImages(imgFormData).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const photo = result.Data.url;
        this.photoArr.push(photo);
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

  uploadVideo(): any {
    const video = $('#create-video-upload')[0].files[0];
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
      
      if (this.videoArr && this.videoArr.length && this.videoArr.length >= 1) {
        this._sNotify.error('Maximum 1 videos can upload!', 'Oops!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.videoArr.push({ video: e.target.result });
      };
      reader.readAsDataURL(video);
      this.allVideosFilesArr.push({ video: video });
      $('#create-video-upload').val(null);
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

  nextStep(): void {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach((key) => {
        this.companyForm.controls[key].touched = true;
        this.companyForm.controls[key].markAsDirty();
      });
      return;
    }
    // this.isLoading = true;
    // this.companyForm.disable();
    const preparedLocationObj: any = this.prepareObj(this.companyForm.value);
    console.log(preparedLocationObj);
    
    // this._createEventService.companyDetail(preparedLocationObj).subscribe((result: any) => {
    //   if (result && result.IsSuccess) {
    //     this.isLoading = false;
    //     this.companyForm.enable();
    //     this._router.navigate(['/events/create/personal-details']);
    //   } else {
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //     this.isLoading = false;
    //     this.companyForm.enable();
    //   }
    // }, (error: any) => {
    //   this._globalFunctions.errorHanding(error, this, true);
    //   this.isLoading = false;
    //   this.companyForm.enable();
    // });
  }

  isString(val: any): boolean {
    return typeof val === 'string';
  }
  
  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    preparedObj.eventid = this.eventId;
    preparedObj.gst = this.gstPdf;
    // preparedObj.photos = this.eventId;
    // preparedObj.videos = this.eventId;
    return preparedObj;

    const companyFormData = this._globalFunctions.copyObject(this.companyForm.value);
    delete companyFormData.images;
    delete companyFormData.videos;
    const pdf = $('input[id=company_gst]')[0].files[0];
    if (pdf != undefined) {
      companyFormData.gst = pdf;
      companyFormData.gst_name = pdf.name;
    } else if (this.eventObj?.company_details?.company_detail?.gst) {
      companyFormData.gst = this.eventObj?.company_details?.company_detail?.gst;
      companyFormData.gst_name = companyFormData.gst.name;
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
          this.allPhotosFilesArr.push({ image: image });
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
          this.allVideosFilesArr.push({ video: video });
        }
      }
    });
    companyObj = {
      companydetail: companyFormData,
    }
    return companyObj;
  }
}
