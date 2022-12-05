import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../shop.service';
import { SnotifyService } from "ng-snotify";
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit {
  addEditOfferForm: any;
  constants: any = CONSTANTS;
  positiveMaxNumber: any = Number.POSITIVE_INFINITY;
  shopId: any;
  shopObj: any;
  offerObj: any;
  dropifyOption: any = {};
  drPosterEvent: any;
  drVideoEvent: any;
  lat: number = 0;
  lng: number = 0;
  zoom: number = CONSTANTS.defaultMapZoom;
  isLoading: boolean = false;
  isUploadPosterLoading: boolean = false;
  isUploadVideoLoading: boolean = false;
  isUploadImageLoading: boolean = false;
  weekdays: any = [
    { value: 'su' },
    { value: 'mo' },
    { value: 'tu' },
    { value: 'we' },
    { value: 'th' },
    { value: 'fr' },
    { value: 'sr' }
  ];

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

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _shopService: ShopService,
    private _activatedRoute: ActivatedRoute,
    private _sNotify: SnotifyService,
  ) { }

  ngOnInit(): void {
    this.shopId = this._activatedRoute.snapshot.paramMap.get('id');

    this.getShop();
    this._prepareAddEditOfferForm();
    // get function ma response ne prepare karti vakhate
    // this.offerOnAllProducts.setValue([(preparedOfferObj.offer_on_all_products) ? 'true' : '']);
  }

  getShop(): void {
    this.isLoading = true;
    this._shopService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
      this.shopObj = result.Data;
      this.weekdays = this.weekdays.map((dayObj: any) => {
        dayObj.isSelected = (this.shopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
      setTimeout(() => {
        this._globalFunctions.loadAccordion();
        // this._globalFunctions.loadTabsJs();
      }, 0);
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  openAddEditOfferDialog(offerObj: any = {}): void {
    this._modalService.open('offerDialog');
    this.offerObj = this._globalFunctions.copyObject(offerObj);

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
  }

  addEditOffer(): any {
    const preparedOfferObj: any = this.prepareOfferObj(this.addEditOfferForm.value);
    console.log(preparedOfferObj);
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
          this._shopService.uploadPoster(photoFormData).subscribe((result: any) => {
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
          this._shopService.uploadVideo(videoFormData).subscribe((result: any) => {
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
        person_limitation: [productLimitationObj?.person_limitation || ''],
        discount: [productLimitationObj?.discount || ''],
        discount_type: [productLimitationObj?.discount_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value]
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

  prepareOfferObj(offerFormObj: any = {}): any {
    const offerObj = this._globalFunctions.copyObject(offerFormObj);
    offerObj.offer_on_all_products = !!(offerFormObj && offerFormObj.offer_on_all_products && offerFormObj.offer_on_all_products.length  && (offerFormObj.offer_on_all_products[0] == 'true' || offerFormObj.offer_on_all_products[0] == true));

    return offerObj;
  }

  private _prepareAddEditOfferForm(offerObj: any = {}): void {
    this.addEditOfferForm = this._formBuilder.group({
      // offerid: [""],
      offer_title: [""],
      start_date: [""],
      end_date: [""],
      poster: [""],
      video: [""],
      description: [""],
      status: [""],
      offer_on_all_products: [''],
      all_product_images: [],
      all_product_conditions: this._formBuilder.array([]),
      offer_type: [""],
      // offer_type_conditions: [],
      tandc: [""],
    });

    if (offerObj && offerObj.arrangements) {
      _.each(offerObj.all_product_conditions, (productOffer: any) => {
        this.addProductLimitation(productOffer);
      });
    } else {
      this.addProductLimitation();
    }
  }
}
