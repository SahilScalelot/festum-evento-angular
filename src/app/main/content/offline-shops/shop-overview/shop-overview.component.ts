import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { ActivatedRoute, Router } from '@angular/router';
import { OfflineShopsService } from '../offline-shops.service';
import { SnotifyService } from "ng-snotify";
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-shop-overview',
  templateUrl: './shop-overview.component.html',
  styleUrls: ['./shop-overview.component.scss']
})
export class ShopOverviewComponent implements OnInit {
  addEditOfferForm: any;
  constants: any = CONSTANTS;
  positiveMaxNumber: any = Number.POSITIVE_INFINITY;
  shopId: any;
  shopObj: any;
  offerObj: any;
  dropifyOption: any = {};
  editorConfig: any = {};
  drPosterEvent: any;
  drVideoEvent: any;
  lat: number = 0;
  lng: number = 0;
  zoom: number = CONSTANTS.defaultMapZoom;
  isTAndC: boolean = false;
  isAddUserWiseOffers: boolean = false;
  isLoading: boolean = false;
  isSaveLoading: boolean = false;
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
  offerId: any;
  paging: any;
  shopOffer: any;
  minDateValue: any = new Date();
  offerImageArray: any = new Array(3);
  detailEditor = DecoupledEditor;

  overview: boolean = true;
  reviews: boolean = false;

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

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _offlineShopsService: OfflineShopsService,
    private _activatedRoute: ActivatedRoute,
    private _sNotify: SnotifyService,
  ) { }

  ngOnInit(): void {
    this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');

    this.getShop();
    this.offlineShopOfferList();
    this._prepareAddEditOfferForm();
    this.editorConfig = {
      toolbar: [
        'heading', '|',
        'fontsize', 'fontfamily', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'alignment', '|',
        'outdent', 'indent', '|',
        'numberedList', 'bulletedList', '|',
        'link', 'mediaembed', 'blockquote', 'insertTable', '|',
        'undo', 'redo'
      ],
      mediaEmbed: { previewsInData: true },
      table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
      language: 'en',
      alignment: { options: ['left', 'right', 'center', 'justify'] },
      fontSize: { options: ['tiny', 'small', 'default', 'big', 'huge'] },
      fontColor: {
        columns: 6,
        colors: [
          { color: '#f05a28', label: 'Theme Orange', class: 'orange' },
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: '#f8696b', label: 'Red 1' },
          { color: '#FFD800', label: 'Yellow 1' },
          { color: '#63be7b', label: 'Green 1' },
          { color: '#f44336', label: 'Red 2' },
          { color: '#ff9100', label: 'Yellow 2' },
          { color: '#4caf50', label: 'Green 2' },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      },
      fontBackgroundColor: {
        columns: 6,
        colors: [
          { color: '#f05a28', label: 'Theme Orange' },
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: '#f8696b', label: 'Red 1' },
          { color: '#FFD800', label: 'Yellow 1' },
          { color: '#63be7b', label: 'Green 1' },
          { color: '#f44336', label: 'Red 2' },
          { color: '#ff9100', label: 'Yellow 2' },
          { color: '#4caf50', label: 'Green 2' },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      }
    };
    // get function ma response ne prepare karti vakhate
    // this.offerOnAllProducts.setValue([(preparedOfferObj.offer_on_all_products) ? 'true' : '']);
  }

  onTextEditorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getShop(): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
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

  offlineShopOfferList(shop: any = ''): void {
    this.isLoading = true;
    const page = shop ? (shop.page + 1) : 1;
    const filter: any = {
      shopid : this.shopId || '',
      page : page || '1',
      limit : shop?.rows || '4',
      search: ""
    };
    this._offlineShopsService.offlineShopOfferList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.paging = result.Data;
        this.shopOffer = result.Data.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
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

  closeAddEditOfferDialog(): void {
    $('.dropify-clear').click();
    this.isTAndC = false;
    this.isAddUserWiseOffers = false;
    this._modalService.close('offerDialog');
  }

  onFileChange(event: any): any {
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

      const imageFormData = new FormData();
      imageFormData.append('file', file);
      this.isUploadImageLoading = true;
      this._offlineShopsService.uploadImage(imageFormData).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.allProductImages.value.push({url: result.Data.url});
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

  onContinueClick(): void {
    console.log(this.addEditOfferForm.value);
    // if (this.addEditOfferForm.invalid) {
    //   Object.keys(this.addEditOfferForm.controls).forEach((key) => {
    //     this.addEditOfferForm.controls[key].touched = true;
    //     this.addEditOfferForm.controls[key].markAsDirty();
    //   });
    //   return;
    // }
    if (this.addEditOfferForm.value && this.addEditOfferForm.value.offer_on_all_products &&
        this.addEditOfferForm.value.offer_on_all_products.length && this.addEditOfferForm.value.offer_on_all_products[0] == 'true') {
      this.isTAndC = true;
      this.isAddUserWiseOffers = false;
    } else {
      this.isTAndC = false;
      this.isAddUserWiseOffers = true;
    }
  }

  onSaveAndContinueClick(): void {
    console.log(this.addEditOfferForm.value);
    // if (this.addEditOfferForm.invalid) {
    //   Object.keys(this.addEditOfferForm.controls).forEach((key) => {
    //     this.addEditOfferForm.controls[key].touched = true;
    //     this.addEditOfferForm.controls[key].markAsDirty();
    //   });
    //   return;
    // }

    this.isTAndC = true;
    this.isAddUserWiseOffers = false;
  }

  prepareOfferObj(offerObj: any): any {
    const preparedOfferObj: any = this._globalFunctions.copyObject(offerObj);
    preparedOfferObj.start_date = moment(offerObj.start_date).format('YYYY-MM-DD');
    preparedOfferObj.end_date = moment(offerObj.end_date).format('YYYY-MM-DD');
    preparedOfferObj.offer_on_all_products = (offerObj && offerObj.offer_on_all_products && offerObj.offer_on_all_products.length  && (offerObj.offer_on_all_products[0] == 'true' || offerObj.offer_on_all_products[0] == true));
    return preparedOfferObj;
  }

  addEditOffer(): any {
    console.log(this.addEditOfferForm);
    if (this.addEditOfferForm.invalid) {
      Object.keys(this.addEditOfferForm.controls).forEach((key) => {
        this.addEditOfferForm.controls[key].touched = true;
        this.addEditOfferForm.controls[key].markAsDirty();
      });
      return;
    }
    const preparedOfferObj: any = this.prepareOfferObj(this.addEditOfferForm.value);
    console.log(preparedOfferObj);
    
    this.isSaveLoading = true;
    this._offlineShopsService.saveOfflineOffer(preparedOfferObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.setPosterInDropify(result.Data.url);
        this._sNotify.success('Poster Uploaded Successfully.', 'Success');
        this.isSaveLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isSaveLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isSaveLoading = false;
    });
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
        person_limitation: [productLimitationObj?.person_limitation || '', [Validators.required]],
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

  private _prepareAddEditOfferForm(offerObj: any = {}): void {
    this.addEditOfferForm = this._formBuilder.group({
      // offerid: [""],
      offer_title: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      poster: [""],
      video: [""],
      description: ["", [Validators.required]],
      status: [false],
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

  gotoShopOfferOverview(event: any, addShopObj: any, offerId: any): void {
    // event.stopPropagation();
    this._router.navigate(['/offline-shops/' + addShopObj + '/offer-overview/' + offerId._id]);
  }
  onTabChange(tabVarName: any): void {
    this.overview = this.reviews = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    }
  }
}
