import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { OnlineOffersService } from '../online-offers.service';
import { ModalService } from 'src/app/main/_modal';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit, OnDestroy {
  constants: any = CONSTANTS;
  positiveMaxNumber: any = Number.POSITIVE_INFINITY;
  inputText: any;
  gstPdf: any;
  // detailEditor = DecoupledEditor;

  isImgLoading: boolean = false;
  isPdfLoading: boolean = false;
  isInValidPDF: boolean = false;
  isCropperLoading: boolean = false;
  isDeleteLoading: boolean = false;

  imgChangeEvt: any;
  posterObj: any;

  photoArr: any = [];
  allPhotosFilesArr: any = [];
  
  addEditOfferForm: any;
  offerId: any;
  
  minDateValue: any = new Date();
  
  dropifyOption: any = {};
  drEvent: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _onlineOffersService: OnlineOffersService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
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
      // this.posterImageAndVideoObj.banner = '';
    });

    if (localStorage.getItem('oOId') || localStorage.getItem('oOId') == '') {
      this.offerId = localStorage.getItem('oOId');
    }
    this._prepareAddEditOfferForm();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('oOId');
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
      if (this.photoArr && this.photoArr.length && this.photoArr.length >= 2) {
        this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
        return false;
      }
      imgFormData.append('file', image);
      this.isImgLoading = true;
      this._onlineOffersService.imageUpload(imgFormData).subscribe((result: any) => {
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

  removeImage(index: number) {
    this.photoArr.splice(index, 1);
    this.allPhotosFilesArr.splice(index, 1);
    this._modalService.open("delete-event-pop");
  }

  close(): void {
    this._modalService.close("delete-event-pop");
  }

  deleteEvent(): void {
    this.isDeleteLoading = true;
    // this.posterImageAndVideoObj[this.deleteItemObj.type].splice(this.deleteItemObj.index, 1);
    this.isDeleteLoading = false;
    // this.deleteItemObj = {};
    this._modalService.close("delete-event-pop");
  }


  isString(val: any): boolean {
    return typeof val === 'string';
  }

  onChangePDF(event: any): any {
    const pdfUpload = $('#company_gst')[0].files[0];
    const pdfFormData = new FormData();
    this.isInValidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload != undefined && pdfUpload.type != 'application/pdf') {
        $('#company_gst').focus();
        this.isInValidPDF = true;
        return false;
      }      
      pdfFormData.append('file', pdfUpload);
      // this.isPdfLoading = true;
      // this._onlineOffersService.uploadDocument(pdfFormData).subscribe((result: any) => {
      //   if (result && result.IsSuccess) {
      //     this.gstPdf = result.Data.url;
      //     this.inputText = _.last(_.split(result.Data.url, '/'));
      //     this._sNotify.success('File Uploaded Successfully.', 'Success');
      //     this.isPdfLoading = false;
      //   } else {
      //     this._globalFunctions.successErrorHandling(result, this, true);
      //     this.isPdfLoading = false;
      //   }
      // }, (error: any) => {
      //   this._globalFunctions.errorHanding(error, this, true);
      //   this.isPdfLoading = false;
      // });
    }
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

  saveAndContinue():void {
    if (this.addEditOfferForm.invalid) {
      Object.keys(this.addEditOfferForm.controls).forEach((key) => {
        this.addEditOfferForm.controls[key].touched = true;
        this.addEditOfferForm.controls[key].markAsDirty();
      });
      return;
    }

    console.log(this.addEditOfferForm.value);
  }

  private _prepareAddEditOfferForm(addEditOfferObj: any = {}): void {
    this.addEditOfferForm = this._formBuilder.group({
      offerid: [this.offerId || ''],
      shop_name: [addEditOfferObj?.shop_name || '', [Validators.required]],
      offer_amount: [addEditOfferObj?.offer_amount || '', [Validators.required]],
      offer_type: [addEditOfferObj?.discount_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value, [Validators.required]],
      start_date: [addEditOfferObj?.start_date || '', [Validators.required]],
      end_date: [addEditOfferObj?.end_date || '', [Validators.required]],
      product_name: [addEditOfferObj?.product_name || '', [Validators.required]],
      poster: [addEditOfferObj?.poster || '', [Validators.required]],
      images: [addEditOfferObj?.images || '', [Validators.required]],
      description: [addEditOfferObj?.description || ''],
      product_links: [addEditOfferObj?.product_links || '', [Validators.required]],
      company_name: [addEditOfferObj?.company_name || '', [Validators.required]],
      company_gst: [addEditOfferObj?.company_gst || ''],
      company_contact_no: [addEditOfferObj?.company_contact_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      company_email: [addEditOfferObj?.company_email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about_company: [addEditOfferObj?.about_company || ''],
      status: [addEditOfferObj?.status || ''],
      tandc: [addEditOfferObj?.tandc || ''],
    });
  }
}