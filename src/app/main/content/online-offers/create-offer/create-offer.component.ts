import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import * as _ from 'lodash';
import { OnlineOffersService } from '../online-offers.service';
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

  isImgLoading: boolean = false;
  isPdfLoading: boolean = false;
  isInValidPDF: boolean = false;

  photoArr: any = [];
  allPhotosFilesArr: any = [];
  
  addEditOfferForm: any;
  offerId: any;
  
  minDateValue: any = new Date();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _onlineOffersService: OnlineOffersService,
    private _globalFunctions: GlobalFunctions,
  ) { }
  
  ngOnInit(): void {
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

  saveAndContinue():void {

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
