import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { OnlineOffersService } from '../online-offers.service';
import { ModalService } from 'src/app/main/_modal';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {CompressImageService} from "../../../../services/compress-image.service";
import { GlobalService } from 'src/app/services/global.service';
import { NgSelectConfig } from "@ng-select/ng-select";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { take } from 'rxjs';
import * as _ from 'lodash';
import * as moment from "moment";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
declare var $: any;

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit, OnDestroy {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  PhoneNumberFormat = PhoneNumberFormat;
  // phoneForm: any;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });
  @ViewChild('phoneF') form: any;

  constants: any = CONSTANTS;
  positiveMaxNumber: any = Number.POSITIVE_INFINITY;
  inputText: any;
  gstPdf: any;
  detailEditor = DecoupledEditor;
  isLoading: boolean = false;
  isImgLoading: boolean = false;
  isIconLoading: boolean = false;
  isPdfLoading: boolean = false;
  isInValidPDF: boolean = false;
  isCropperLoading: boolean = false;
  isDeleteLoading: boolean = false;
  isSaveLoading: boolean = false;
  isPlatformLoading: boolean = false;
  successfully: boolean = false;
  // minDateValue: any = new Date();
  minDateValue: any = new Date(new Date().setDate(new Date().getDate() + 2));
  minStartDateValue: any = '';
  imgChangeEvt: any;
  posterObj: any = {};
  addEditOfferForm: any;
  tandcForm: any;
  offerId: any;
  offerObj: any;
  platformObj: any = {};
  dropifyOption: any = {};
  drEvent: any;
  cropImgPreview: any = '';
  isPosterLoading: boolean = false;
  editorConfig: any = {};
  platformArr: any = [];
  deleteItemObj: any = {};

  proDescTextEditor: boolean = false;
  proDescTextEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  proDescTextEditorLimit: any = this.proDescTextEditorMaxLimit;

  comDescTextEditor: boolean = false;
  comDescTextEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  comDescTextEditorLimit: any = this.comDescTextEditorMaxLimit;

  tcDescTextEditor: boolean = false;
  tcDescTextEditorMaxLimit: any = this.constants.CKEditorCharacterLimit3;
  tcDescTextEditorLimit: any = this.tcDescTextEditorMaxLimit;

  get poster(): any {
    return this.addEditOfferForm?.get('poster');
  }
  get images(): any {
    return this.addEditOfferForm?.get('images');
  }
  get companyGST(): any {
    return this.addEditOfferForm?.get('company_gst');
  }
  get productLinks(): any {
    return this.addEditOfferForm?.get('product_links');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _onlineOffersService: OnlineOffersService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _compressImageService: CompressImageService,
    private _config: NgSelectConfig,
    private _globalService: GlobalService
  ) {
    this._config.notFoundText = 'Platform not found';
  }
  
  ngOnInit(): void {
    const todayDate = new Date();
    const minSetDate = new Date('06-01-2023');
    this.minStartDateValue = (todayDate >= minSetDate) ? this.minDateValue : minSetDate;
    
    this.getPlatformList();
    this.editorConfig = CONSTANTS.editorConfig;
    this.dropifyOption = {
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    this.drEvent.on('dropify.afterClear', (event: any, element: any) => {
      this.poster?.setValue('');
    });
    this._prepareAddEditOfferForm();
    if (localStorage.getItem('oOId') && localStorage.getItem('oOId') != '') {
      this.offerId = localStorage.getItem('oOId');
      this.getOnlineShopOfferByOfferId(this.offerId);
    } else {
      this._globalService.loginUser$.subscribe((user: any) => {
        if (user) {
          const businessProfile: any = this._globalFunctions.copyObject(user?.businessProfile || {});
          const companyObj: any = {
            company_name: businessProfile?.name || '',
            company_contact_no: businessProfile?.mobile || '',
            company_email: businessProfile?.email || '',
            about_company: businessProfile?.about || '',
          }
          this.addEditOfferForm.patchValue(companyObj);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
  }

  getPlatformList(): void {
    this.isLoading = true;
    this._onlineOffersService.getPlatformList().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.platformArr = result?.Data || [];
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

  getOnlineShopOfferByOfferId(offerId: any = ''): void {
    this.isLoading = true;
    this._onlineOffersService.getOnlineOfferById(offerId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const offerObj: any = result?.Data || {};
        this._prepareAddEditOfferForm(offerObj || {});
        if (offerObj.poster) {
          this.setPosterInDropify(offerObj.poster);
        }
        if (offerObj.company_gst) {
          this.inputText = _.last(_.split(offerObj.company_gst, '/'));
        }
        if (offerObj && offerObj.country_wise_contact && offerObj.country_wise_contact != '') { 
          this.phoneForm.patchValue({
            phone: offerObj.country_wise_contact
          });
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

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  imageLoaded(): void {
    this.isCropperLoading = false;
  }

  savePoster(img: any) {
    if (img && img != '' && !this.isPosterLoading) {
      const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      this._compressImageService.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (compressedImage) {
          const posterFormData = new FormData();
          posterFormData.append('file', compressedImage);
          this.isPosterLoading = true;
          this._onlineOffersService.uploadBanner(posterFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.posterObj.image = img;
              this.setPosterInDropify(result.Data.url);
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
    this.poster.setValue(image);
  }

  popClose(popId: any): any {
    $('.dropify-clear').click();
    this._modalService.close(popId);
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
      if (this.images && this.images.value && this.images.value.length && this.images.value.length >= 2) {
        this._sNotify.error('Maximum 2 images can upload!', 'Oops!');
        return false;
      }
      imgFormData.append('file', image);
      this.isImgLoading = true;
      this._onlineOffersService.imageUpload(imgFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const newImages = this.images?.value || [];
          newImages.push({url: result.Data.url});
          this.images.setValue(newImages);
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
    this.deleteItemObj = {index: index, type: 'photo'};
    this._modalService.open("delete-image-pop");
  }

  close(): void {
    this._modalService.close("delete-image-pop");
    this.deleteItemObj = {};
  }

  deleteImage(): void {
    this.isDeleteLoading = true;
    this.images.value.splice(this.deleteItemObj.index, 1);
    this.isDeleteLoading = false;
    this.deleteItemObj = {};
    this._modalService.close("delete-image-pop");
  }

  onChangePDF(event: any): any {
    const pdfUpload = $('#company_gst')[0].files[0];
    const pdfFormData = new FormData();
    this.isInValidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload.type != 'application/pdf') {
        $('#company_gst').focus();
        this.isInValidPDF = true;
        return false;
      }      
      pdfFormData.append('file', pdfUpload);
      this.isPdfLoading = true;
      this._onlineOffersService.uploadDocument(pdfFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.companyGST.setValue(result.Data.url);
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

  validateForm(isTandC: boolean = false): any {
    if (!isTandC && this.addEditOfferForm.invalid) {
      Object.keys(this.addEditOfferForm.controls).forEach((key) => {
        this.addEditOfferForm.controls[key].touched = true;
        this.addEditOfferForm.controls[key].markAsDirty();
      });

      Object.keys(this.productLinks.controls).forEach((key) => {
        Object.keys(this.productLinks.controls[key].controls).forEach((subKey) => {
          this.productLinks.controls[key].controls[subKey].touched = true;
          this.productLinks.controls[key].controls[subKey].markAsDirty();
        });
      });
      return false;
    } else if (this.productLinks.value && this.productLinks.value.length) {
      const tmpGroupByPlatformIdObj = _.groupBy(this.productLinks.value, 'platform');
      let flag = true;
      for (const key in tmpGroupByPlatformIdObj) {
        if (tmpGroupByPlatformIdObj && tmpGroupByPlatformIdObj[key] && tmpGroupByPlatformIdObj[key].length && tmpGroupByPlatformIdObj[key].length > 1) {
          flag = false;
        }
      }
      if (!flag) {
        this._sNotify.error('Platform already selected please select another platform.', 'Oops!');
        return false;
      }
    } else if (isTandC && this.tandcForm.invalid) {
      Object.keys(this.tandcForm.controls).forEach((key) => {
        this.tandcForm.controls[key].touched = true;
        this.tandcForm.controls[key].markAsDirty();
      });
      return false;
    }
    return false;
  }

  saveAndContinue(): any {
    if (!this.validateForm()) {
      return false;
    }
    if (this.proDescTextEditorLimit && this.proDescTextEditorMaxLimit && this.proDescTextEditorLimit > this.proDescTextEditorMaxLimit) {
      this._sNotify.error('Product Description Limit.', 'Oops!');
      return;
    }
    if (this.comDescTextEditorLimit && this.comDescTextEditorMaxLimit && this.comDescTextEditorLimit > this.comDescTextEditorMaxLimit) {
      this._sNotify.error('Product Description Limit.', 'Oops!');
      return;
    }
    this._modalService.open("tAndC");
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  prepareOfferObj(onlineShopOfferObj: any = {}): any {
    const preparedOnlineShopOfferObj: any = this._globalFunctions.copyObject(onlineShopOfferObj);
    preparedOnlineShopOfferObj.tandc = this.tandcForm?.value;
    preparedOnlineShopOfferObj.status = true;
    preparedOnlineShopOfferObj.start_date = moment(onlineShopOfferObj.start_date).format('YYYY-MM-DD');
    preparedOnlineShopOfferObj.end_date = moment(onlineShopOfferObj.end_date).format('YYYY-MM-DD');
    
    preparedOnlineShopOfferObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedOnlineShopOfferObj.dial_code = preparedOnlineShopOfferObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedOnlineShopOfferObj.country_wise_contact?.e164Number || '';
    preparedOnlineShopOfferObj.company_contact_no = contactNumber.replace(preparedOnlineShopOfferObj.dial_code, '') || '';
    return preparedOnlineShopOfferObj;
  }

  addEditOnlineShopOffer(): any {
    if (!this.validateForm(true)) {
      return false;
    }
    if (this.proDescTextEditorLimit && this.proDescTextEditorMaxLimit && this.proDescTextEditorLimit > this.proDescTextEditorMaxLimit) {
      return;
    }
    if (this.comDescTextEditorLimit && this.comDescTextEditorMaxLimit && this.comDescTextEditorLimit > this.comDescTextEditorMaxLimit) {
      return;
    }
    if (this.tcDescTextEditorLimit && this.tcDescTextEditorMaxLimit && this.tcDescTextEditorLimit > this.tcDescTextEditorMaxLimit) {
      return;
    }
    const preparedOnlineShopOfferObj: any = this.prepareOfferObj(this.addEditOfferForm.value);
    this.isSaveLoading = true;
    this._onlineOffersService.createOnlineOffer(preparedOnlineShopOfferObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.successfully = true;
        setTimeout(() => {
          this._modalService.close("tAndC");
          this.successfully = false;
          this._router.navigate(['/online-offers']);
          this.isSaveLoading = false;
        }, 3000);
        // this._sNotify.success('Online Service Created Successfully.', 'Success');
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isSaveLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isSaveLoading = false;
    });
  }

  addProductLink(tempPlatformObj: any = {}): void {
    const platformObj = this._formBuilder.group({
      platform: [tempPlatformObj?.platform?._id || '', [Validators.required]],
      product_link: [tempPlatformObj?.product_link || '', [Validators.required]],
      short_link_id: [tempPlatformObj?.short_link_id || ''],
    });
    this.productLinks.push(platformObj);
  }

  removeProductLink(index: any): void {
    if (this.productLinks.get(index.toString())) {
      this.productLinks.removeAt(index.toString());
      this.productLinks.updateValueAndValidity();
    }
  }

  onChangePlatformImage(event: any): any {
    if (!event || !event.target || !event.target.files || !event.target.files.length) {
      return false;
    }
    const image = event.target.files[0];
    const imgFormData = new FormData();
    if (image != undefined) {
      if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png' && image.type != 'image/x-icon') {
        this._sNotify.error('Image type is Invalid.', 'Oops!');
        return false;
      }
      const image_size = image.size / 1024;
      if (image_size > CONSTANTS.maxIconSizeInKB) {
        this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxIconSizeInKB + 'KB.', 'Oops!');
        return false;
      }
      imgFormData.append('file', image);
      this.isIconLoading = true;
      this._onlineOffersService.uploadPlatformImage(imgFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.platformObj.platformimage = result.Data.url;
          this._sNotify.success('Platform Icon Uploaded Successfully.', 'Success');
          this.isIconLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isIconLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isIconLoading = false;
      });
    }
  }

  editorCharacterSet(editorField: string = ''): any {
    if (editorField == 'description') {
      this.proDescTextEditorLimit = '0';
      const stringOfCKEditor = this._globalFunctions.getPlainText(this.addEditOfferForm.value.description);
      this.proDescTextEditorLimit = stringOfCKEditor.length;
      this.proDescTextEditor = (stringOfCKEditor.length > this.proDescTextEditorMaxLimit);
    } else if (editorField == 'company') {
      this.comDescTextEditorLimit = '0';
      const stringOfCKEditor = this._globalFunctions.getPlainText(this.addEditOfferForm.value.about_company);
      this.comDescTextEditorLimit = stringOfCKEditor.length;
      this.comDescTextEditor = (stringOfCKEditor.length > this.comDescTextEditorMaxLimit);
    } else if (editorField == 'tc') {
      this.tcDescTextEditorLimit = '0';
      const stringOfCKEditor = this._globalFunctions.getPlainText(this.tandcForm.value.t_and_c);
      this.tcDescTextEditorLimit = stringOfCKEditor.length;
      this.tcDescTextEditor = (stringOfCKEditor.length > this.tcDescTextEditorMaxLimit);
    }
  }

  tAndCPop(): void {
    if (this.tandcForm.value && this.tandcForm.value.status == false) {
      this.tandcForm.get('status').setValue(false);
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.tandcForm.get('status').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.tandcForm.get('status').setValue(true);
    this._modalService.close("tandc");
  }

  validatePlatformObj(): any {
    if (!this.platformObj.platformimage || this.platformObj.platformimage == '') {
      this._sNotify.error('Platform icon is required', 'Oops!');
      return false;
    }
    if (!this.platformObj.name || this.platformObj.name == '') {
      this._sNotify.error('Platform name is required', 'Oops!');
      return false;
    }
    return true;
  }

  checkValidPlatform(platformId: any = ""): any {
    const tmpGroupByPlatformIdObj = _.groupBy(this.productLinks.value, 'platform');
    if (tmpGroupByPlatformIdObj && tmpGroupByPlatformIdObj[platformId?._id] && tmpGroupByPlatformIdObj[platformId?._id].length && tmpGroupByPlatformIdObj[platformId?._id].length > 1) {
      this._sNotify.error('Platform already selected please select another platform.', 'Oops!');
    }
  }

  addPlatform(): any {
    this.isPlatformLoading = true;
    if (!this.validatePlatformObj()) {
      this.isPlatformLoading = false;
      return false;
    }
    this.platformObj.platformid = '';
    this.platformObj.description = '';
    this.platformObj.status = true;
    this._onlineOffersService.savePlatform(this.platformObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.platformArr = [...this.platformArr, result.Data];
        this._sNotify.success('Platform Saved Successfully.', 'Success');
        this.platformObj = {};
        this.isPlatformLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isPlatformLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isPlatformLoading = false;
    });
  }

  private _prepareAddEditOfferForm(addEditOfferObj: any = {}): void {
    this.addEditOfferForm = this._formBuilder.group({
      offerid: [this.offerId || ''],
      shop_name: [addEditOfferObj?.shop_name || '', [Validators.required]],
      offer_amount: [addEditOfferObj?.offer_amount || '', [Validators.required]],
      offer_type: [addEditOfferObj?.offer_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value, [Validators.required]],
      start_date: [(addEditOfferObj.start_date) ? new Date(addEditOfferObj.start_date) : '', [Validators.required]],
      end_date: [(addEditOfferObj.end_date) ? new Date(addEditOfferObj.end_date) : '', [Validators.required]],
      product_name: [addEditOfferObj?.product_name || '', [Validators.required]],
      poster: [addEditOfferObj?.poster || '', [Validators.required]],
      images: [addEditOfferObj?.images || '', [Validators.required]],
      description: [addEditOfferObj?.description || ''],
      product_links: this._formBuilder.array([]),
      company_name: [addEditOfferObj?.company_name || '', [Validators.required]],
      company_gst: [addEditOfferObj?.company_gst || ''],
      // company_contact_no: [addEditOfferObj?.company_contact_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      company_email: [addEditOfferObj?.company_email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about_company: [addEditOfferObj?.about_company || '']
    });
    if (addEditOfferObj && addEditOfferObj.product_links) {
      _.each(addEditOfferObj.product_links, (platformObj: any) => {
        this.addProductLink(platformObj);
      });
    } else {
      this.addProductLink();
    }

    this.tandcForm = this._formBuilder.group({
      t_and_c: [addEditOfferObj?.tandc?.t_and_c || '', [Validators.required]],
      facebook: [addEditOfferObj?.tandc?.facebook || ''],
      twitter: [addEditOfferObj?.tandc?.twitter || ''],
      youtube: [addEditOfferObj?.tandc?.youtube || ''],
      pinterest: [addEditOfferObj?.tandc?.pinterest || ''],
      instagram: [addEditOfferObj?.tandc?.instagram || ''],
      linkedin: [addEditOfferObj?.tandc?.linkedin || ''],
      status: [false, [Validators.requiredTrue]],
    });

    if (addEditOfferObj?.description) {
      this.editorCharacterSet('description');
    }
    if (addEditOfferObj?.about_company) {
      this.editorCharacterSet('company');
    }
    if (addEditOfferObj?.tandc?.t_and_c) {
      this.editorCharacterSet('tc');
    }
  }
}