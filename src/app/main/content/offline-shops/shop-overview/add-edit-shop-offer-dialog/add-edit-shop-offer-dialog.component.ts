import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { GlobalFunctions } from '../../../../common/global-functions';
import { CONSTANTS } from '../../../../common/constants';
import { OfflineShopsService } from '../../offline-shops.service';
import { SnotifyService } from 'ng-snotify';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ModalService } from 'src/app/main/_modal';
declare var $: any;

@Component({
  selector: 'app-add-edit-shop-offer-dialog',
  templateUrl: './add-edit-shop-offer-dialog.component.html',
  styleUrls: ['./add-edit-shop-offer-dialog.component.scss']
})
export class AddEditShopOfferDialogComponent implements OnInit {
  offerObj: any;
  addEditOfferForm: any;
  constants: any = CONSTANTS;
  minDateValue: any = new Date(new Date().setDate(new Date().getDate() + 2));
  minStartDateValue: any = '';
  positiveMaxNumber: any = Number.POSITIVE_INFINITY;
  dropifyOption: any = {};
  editorConfig: any = {};
  drPosterEvent: any;
  drVideoEvent: any;
  isTAndC: boolean = false;
  isAddUserWiseOffers: boolean = false;
  isLoading: boolean = false;
  isSaveLoading: boolean = false;
  isUploadPosterLoading: boolean = false;
  isUploadVideoLoading: boolean = false;
  isUploadImageLoading: boolean = false;
  offerImageArray: any = new Array(3);
  detailEditor = DecoupledEditor;
  successfully: boolean = false;

  get offerOnAllProducts(): any {
    return this.addEditOfferForm.get('offer_on_all_products');
  }
  get allProductConditions(): any {
    return this.addEditOfferForm.get('all_product_conditions') as FormArray;
  }
  get poster(): any {
    return this.addEditOfferForm?.get('poster');
  }
  get video(): any {
    return this.addEditOfferForm?.get('video');
  }
  get allProductImages(): any {
    return this.addEditOfferForm?.get('all_product_images');
  }
  get offerType(): any {
    return this.addEditOfferForm?.get('offer_type');
  }
  get offerTypeConditions(): any {
    return this.addEditOfferForm.get('offer_type_conditions') as FormArray;
  }

  @Input() shopId: any = '';
  @Input() offerId: any = '';
  @Output() flagsEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeAddEditOfferFormEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('offerNgForm') offerNgForm: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _offlineShopsService: OfflineShopsService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
  ) { }

  ngOnInit(): void {
    const todayDate = new Date();
    const minSetDate = new Date('06-01-2023');
    this.minStartDateValue = (todayDate >= minSetDate) ? this.minDateValue : minSetDate;

    this._prepareOfferForm();
    this.editorConfig = CONSTANTS.editorConfig;

    setTimeout(() => {
      this.dropifyOption = {
        messages: {
          default: 'Add Poster',
          icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
        }
      };
      this.dropifyOption.messages.default = 'Add Poster';
      this.drPosterEvent = $('#poster-upload').dropify(this.dropifyOption);
      this.drPosterEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.poster?.setValue('');
      });

      this.dropifyOption.messages.default = 'Add Video';
      this.drVideoEvent = $('#video-upload').dropify(this.dropifyOption);
      this.drVideoEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.video?.setValue('');
      });
      if (this.offerId && this.offerId != '') {
        this.getOfflineShopOfferByOfferId(this.offerId);
      }
    }, 0);
  }

  getOfflineShopOfferByOfferId(offerId: any = ''): void {
    this.isLoading = true;
    const offerObj: any = {
      shopid : this.shopId || '',
      offlineofferid : offerId || '',
    };
    this._offlineShopsService.getOfflineOffer(offerObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.offerObj = result.Data;
        this._prepareOfferForm(result.Data);
        if (result?.Data?.poster) {
          this.setPosterInDropify(result?.Data?.poster);
        }
        if (result?.Data?.video) {
          this.setVideoInDropify(result?.Data?.video);
        }
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  onSelectOfferOnAllProduct(event: any = {}): void {
    if (event.checked && event.checked.length && event.checked[0] && event.checked[0] == 'true') {
      this.addProductLimitation();
    } else {
      this.allProductConditions.clear();
    }
  }

  onFileChange(event: any, isProductFormValidation: boolean = false, index: any = -1): any {
    const file = event.target.files[0];
    if (!this.isUploadImageLoading && file != undefined) {
      if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type != 'image/png') {
        this._sNotify.error('Image type is Invalid.', 'Oops!');
        return false;
      }
      const image_size = file.size / 1024 / 1024;
      if (image_size > CONSTANTS.maxImageSizeInMB) {
        this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
        return false;
      }

      this.uploadImage(file, isProductFormValidation, index);
    }
  }

  uploadImage(file: any, isProductFormValidation: boolean = false, index: any): void {
    if (file != undefined) {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      this.isUploadImageLoading = true;
      this._offlineShopsService.uploadImage(imageFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          if (isProductFormValidation && index != -1) {
            this.offerTypeConditions.get(index.toString()).patchValue({
              url: result.Data.url
            });
          } else {
            const newProductImages = this.allProductImages?.value || [];
            newProductImages.push({url: result.Data.url});
            this.allProductImages.setValue(newProductImages);
          }
          this._sNotify.success('File Uploaded Successfully.', 'Success');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
        this.isUploadImageLoading = false;
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isUploadImageLoading = false;
      });
    }
  }

  removeImage(index: number):void {
    this.allProductImages.value.splice(index, 1);
  }

  checkValidation(isForTAndC: boolean = false, isProductFormValidation: boolean = false): any {
    if (this.addEditOfferForm.invalid) {
      Object.keys(this.addEditOfferForm.controls).forEach((key) => {        
        this.addEditOfferForm.controls[key].touched = true;
        this.addEditOfferForm.controls[key].markAsDirty();
      });
      if (isForTAndC) {
        if (!this.allProductImages || !this.allProductImages.value || !this.allProductImages.value.length) {
          this.allProductImages.setErrors({'required': true});
        } else {
          this.allProductImages.setErrors(null);
        }
        Object.keys(this.allProductConditions.controls).forEach((key) => {
          Object.keys(this.allProductConditions.controls[key].controls).forEach((subKey) => {
            this.allProductConditions.controls[key].controls[subKey].touched = true;
            this.allProductConditions.controls[key].controls[subKey].markAsDirty();
          });
        });
      } else if (isProductFormValidation) {
        Object.keys(this.offerTypeConditions.controls).forEach((key) => {
          Object.keys(this.offerTypeConditions.controls[key].controls).forEach((subKey) => {
            this.offerTypeConditions.controls[key].controls[subKey].touched = true;
            this.offerTypeConditions.controls[key].controls[subKey].markAsDirty();
          });
        });
      }
      return false;
    }
    return true;
  }

  onContinueClick(): any {
    const isForTAndC: boolean = !!(this.offerOnAllProducts && this.offerOnAllProducts.value && this.offerOnAllProducts.value.length && this.offerOnAllProducts.value[0] == 'true');
    if (!this.checkValidation(isForTAndC)) {
      return false;
    }
    if (isForTAndC) {
      this.addEditOfferForm.get('tandc').setValidators([Validators.required]);
      this.addEditOfferForm.get('tandc').updateValueAndValidity();
      this.isTAndC = true;
      this.isAddUserWiseOffers = false;
    } else {
      if (!this.offerObj || !this.offerObj.offer_type_conditions || !this.offerObj.offer_type_conditions.length) { 
        this.addProductOffer({}, this.offerType.value);
      }
      this.isTAndC = false;
      this.isAddUserWiseOffers = true;
    }
    this.flagsEvent.emit({isTAndC: this.isTAndC, isAddUserWiseOffers: this.isAddUserWiseOffers});
  }

  onSaveAndContinueClick(): any {
    const isForTAndC: boolean = !!(this.offerOnAllProducts && this.offerOnAllProducts.value && this.offerOnAllProducts.value.length && this.offerOnAllProducts.value[0] == 'true');
    if (!this.checkValidation(isForTAndC, true)) {
      return false;
    }

    this.addEditOfferForm.get('tandc').setValidators([Validators.required]);
    this.addEditOfferForm.get('tandc').updateValueAndValidity();
    this.isTAndC = true;
    this.isAddUserWiseOffers = false;
    this.flagsEvent.emit({isTAndC: this.isTAndC, isAddUserWiseOffers: this.isAddUserWiseOffers});
  }

  prepareOfferObj(offerObj: any): any {
    const preparedOfferObj: any = this._globalFunctions.copyObject(offerObj);
    preparedOfferObj.start_date = moment(offerObj.start_date).format('YYYY-MM-DD');
    preparedOfferObj.end_date = moment(offerObj.end_date).format('YYYY-MM-DD');
    preparedOfferObj.offer_on_all_products = (offerObj && offerObj.offer_on_all_products && offerObj.offer_on_all_products.length  && (offerObj.offer_on_all_products[0] == 'true' || offerObj.offer_on_all_products[0] == true));
    return preparedOfferObj;
  }

  addEditOffer(): any {
    const isForTAndC: boolean = !!(this.offerOnAllProducts && this.offerOnAllProducts.value && this.offerOnAllProducts.value.length && this.offerOnAllProducts.value[0] == 'true');
    if (!this.checkValidation(isForTAndC, true)) {
      return false;
    }
    this.isSaveLoading = true;
    const preparedOfferObj: any = this.prepareOfferObj(this.addEditOfferForm.value);
    this._offlineShopsService.saveOfflineOffer(preparedOfferObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.setPosterInDropify(result.Data.url);
        this.successfully = true;
        setTimeout(() => {
          this.successfully = false;
          this.closeAddEditOfferDialog(true);
        }, 3000);
        // this._sNotify.success('Offer Stored Successfully.', 'Success');
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isSaveLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isSaveLoading = false;
    });
  }

  closeAddEditOfferDialog(isReload: boolean = false): void {
    $('.dropify-clear').click();
    this.isTAndC = false;
    this.isAddUserWiseOffers = false;
    this.offerNgForm.resetForm();
    this.allProductConditions.clear();
    this.offerTypeConditions.clear();

    // this.addEditOfferForm.get('tandc').clearValidators();
    // this.addEditOfferForm.get('tandc').updateValueAndValidity();
    this.offerType.setValue(CONSTANTS.offerTypeArr[CONSTANTS.offerTypeObj.unlimited].value);
    this.flagsEvent.emit({isTAndC: this.isTAndC, isAddUserWiseOffers: this.isAddUserWiseOffers});
    this.closeAddEditOfferFormEvent.emit(isReload);
  }

  closeTermsAndConditionDialog(isReload: boolean = false): void {
    setTimeout(() => {
      this.dropifyOption = {
        messages: {
          default: 'Add Poster',
          icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
        }
      };
      this.dropifyOption.messages.default = 'Add Poster';
      this.drPosterEvent = $('#poster-upload').dropify(this.dropifyOption);
      this.drPosterEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.poster?.setValue('');
      });

      this.dropifyOption.messages.default = 'Add Video';
      this.drVideoEvent = $('#video-upload').dropify(this.dropifyOption);
      this.drVideoEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.video?.setValue('');
      });
      
      const offerObj: any = {
        shopid : this.shopId || '',
        offlineofferid : this.offerId || '',
      };

      this._offlineShopsService.getOfflineOffer(offerObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.offerObj = result.Data;
          if (result?.Data?.poster) {
            this.setPosterInDropify(result?.Data?.poster);
          }
          if (result?.Data?.video) {
            this.setVideoInDropify(result?.Data?.video);
          }
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      })

      // if (this.offerId && this.offerId != '') {
      //   this.getOfflineShopOfferByOfferId(this.offerId);
      // }
    }, 0);
    this.isTAndC == false && this.isAddUserWiseOffers ==false 
    this.isTAndC=false
  }

  closeEditOfferProductDialog(isReload: boolean = false): void {
    setTimeout(() => {
      this.dropifyOption = {
        messages: {
          default: 'Add Poster',
          icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
        }
      };
      this.dropifyOption.messages.default = 'Add Poster';
      this.drPosterEvent = $('#poster-upload').dropify(this.dropifyOption);
      this.drPosterEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.poster?.setValue('');
      });

      this.dropifyOption.messages.default = 'Add Video';
      this.drVideoEvent = $('#video-upload').dropify(this.dropifyOption);
      this.drVideoEvent.on('dropify.afterClear', (event: any, element: any) => {
        this.video?.setValue('');
      });

      const offerObj: any = {
        shopid : this.shopId || '',
        offlineofferid : this.offerId || '',
      };

      this._offlineShopsService.getOfflineOffer(offerObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.offerObj = result.Data;
          if (result?.Data?.poster) {
            this.setPosterInDropify(result?.Data?.poster);
          }
          if (result?.Data?.video) {
            this.setVideoInDropify(result?.Data?.video);
          }
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      })
      
      // if (this.offerId && this.offerId != '') {
      //   this.getOfflineShopOfferByOfferId(this.offerId);
      // }
    }, 0);
    this.isTAndC == false && this.isAddUserWiseOffers ==false
    this.isAddUserWiseOffers =false
  }


  onPosterChange(event: any): any {
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

        if (!this.isUploadPosterLoading) {
          const photoFormData = new FormData();
          photoFormData.append('file', poster);
          this.isUploadPosterLoading = true;
          this._offlineShopsService.uploadPoster(photoFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.setPosterInDropify(result.Data.url);
              this._sNotify.success('Poster Uploaded Successfully.', 'Success');
              this.isUploadPosterLoading = false;
            } else {
              this._globalFunctions.successErrorHandling(result, this, true);
            }
            this.isUploadPosterLoading = false;
          }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
            this.isUploadPosterLoading = false;
          });
        }
      }
    }
  }

  setPosterInDropify(poster: any = ''): void {
    const posterUrl = CONSTANTS.baseImageURL + poster;
    this.drPosterEvent = this.drPosterEvent.data('dropify');
    this.drPosterEvent.resetPreview();
    this.drPosterEvent.clearElement();
    this.drPosterEvent.settings.defaultFile = posterUrl;
    this.drPosterEvent.destroy();
    this.drPosterEvent.init();

    this.dropifyOption.defaultFile = posterUrl;
    this.drPosterEvent = $('.poster-upload').dropify(this.dropifyOption);
    this.poster?.setValue(poster);
  }

  onVideoChange(event: any): any {
    if (event.target.files.length > 0) {
      const video = event.target.files[0];
      if (video != undefined) {
        if (video.type != 'video/mp4') {
          this._sNotify.error('Video type should only mp4.', 'Oops!');
          $('#create-video-upload').focus();
          return false;
        }
        const videoSize = video.size / 1024 / 1024;
        if (videoSize > CONSTANTS.maxVideoSizeInMB) {
          this._sNotify.error('Maximum Video Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
          return false;
        }

        if (!this.isUploadVideoLoading) {
          const videoFormData = new FormData();
          videoFormData.append('file', video);
          this.isUploadVideoLoading = true;
          this._offlineShopsService.uploadVideo(videoFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.setVideoInDropify(result.Data.url);
              this._sNotify.success('Video Uploaded Successfully.', 'Success');
              this.isUploadVideoLoading = false;
            } else {
              this._globalFunctions.successErrorHandling(result, this, true);
            }
            this.isUploadVideoLoading = false;
          }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
            this.isUploadVideoLoading = false;
          });
        }
      }
    }
  }

  setVideoInDropify(video: any = ''): void {
    const videoUrl = CONSTANTS.baseImageURL + video;
    this.drVideoEvent = this.drVideoEvent.data('dropify');
    this.drVideoEvent.resetPreview();
    this.drVideoEvent.clearElement();
    this.drVideoEvent.settings.defaultFile = videoUrl;
    this.drVideoEvent.destroy();
    this.drVideoEvent.init();

    this.dropifyOption.defaultFile = videoUrl;
    this.drVideoEvent = $('.video-upload').dropify(this.dropifyOption);
    this.video?.setValue(video);
  }

  addProductLimitation(productLimitationObj: any = {}): void {
    if (this.allProductConditions.length < CONSTANTS.maxOfferOnAllProductsLimit) {
      const productLimitation: any = this._formBuilder.group({
        person_limitation: [productLimitationObj?.person_limitation || '', [Validators.required, Validators.min(0)]],
        description: [productLimitationObj?.description || '', [Validators.required]],
        discount: [productLimitationObj?.discount || '', [Validators.required]],
        discount_type: [productLimitationObj?.discount_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value, [Validators.required]]
      });
      this.allProductConditions.push(productLimitation);
    }
  }

  removeProductLimitation(index: any): void {
    if (this.allProductConditions.get(index.toString())) {
      this.allProductConditions.removeAt(index.toString());
      this.allProductConditions.updateValueAndValidity();
    }
  }

  onOfferTypeChange(): void {
    this.offerTypeConditions.clear();
    this.addProductOffer({}, this.offerType.value);
  }

  addProductOffer(productOfferObj: any = {}, personType: any = ''): void {
    const isLimitedPersons: boolean = (personType == CONSTANTS.offerTypeArr[CONSTANTS.offerTypeObj.limited].value);
    const productOffer: any = this._formBuilder.group({
      url: [productOfferObj?.url || '', [Validators.required]],
      product_name: [productOfferObj?.product_name || '', [Validators.required]],
      discount: [productOfferObj?.discount || '', [Validators.required]],
      discount_type: [productOfferObj?.discount_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value, [Validators.required]]
    });
    if (isLimitedPersons) {
      productOffer.addControl('person_limitation', new FormControl(productOfferObj?.person_limitation || '', Validators.required));
    }
    this.offerTypeConditions.push(productOffer);
  }

  removeProductOffer(index: any): void {
    if (this.offerTypeConditions.get(index.toString())) {
      this.offerTypeConditions.removeAt(index.toString());
      this.offerTypeConditions.updateValueAndValidity();
    }
  }

  
  tAndCPop(): void {
    if (this.addEditOfferForm.value && this.addEditOfferForm.value.status == false) {
      this.addEditOfferForm.get('status').setValue(false);
      this._modalService.open("tandc");
    }else{
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.addEditOfferForm.get('status').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.addEditOfferForm.get('status').setValue(true);
    this._modalService.close("tandc");
  }

  private _prepareOfferForm(offerObj: any = {}): void {
    this.addEditOfferForm = this._formBuilder.group({
      shopid: [this.shopId || ''],
      offerid: [this.offerId || ''],
      offer_title: [offerObj?.offer_title || '', [Validators.required]],
      start_date: [(offerObj.start_date) ? new Date(offerObj.start_date) : '', [Validators.required]],
      end_date: [(offerObj.end_date) ? new Date(offerObj.end_date) : '', [Validators.required]],
      poster: [offerObj?.poster || '', [Validators.required]],
      video: [offerObj?.video || ''],
      description: [offerObj?.description || '', [Validators.required]],
      status: [offerObj?.status || false],
      offer_on_all_products: [(offerObj.offer_on_all_products) ? [offerObj.offer_on_all_products.toString()] : ''],
      all_product_images: [(offerObj.all_product_images && offerObj.all_product_images.length) ? offerObj.all_product_images : []],
      all_product_conditions: this._formBuilder.array([]),
      offer_type: [offerObj?.offer_type || CONSTANTS.offerTypeArr[CONSTANTS.offerTypeObj.unlimited].value],
      offer_type_conditions: this._formBuilder.array([]),
      tandc: [offerObj?.tandc || ''],
    });

    if (offerObj && offerObj.all_product_conditions && offerObj.all_product_conditions.length) {
      _.each(offerObj.all_product_conditions, (productOffer: any) => {
        this.addProductLimitation(productOffer);
      });
    }
    if (offerObj && offerObj.offer_type_conditions && offerObj.offer_type_conditions.length) {
      _.each(offerObj.offer_type_conditions, (productOffer: any) => {
        this.addProductOffer(productOffer, this.offerType.value);
      });
    }
  }
}
