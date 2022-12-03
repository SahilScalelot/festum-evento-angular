import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CompressImageService } from 'src/app/services/compress-image.service';
import { GlobalFunctions } from '../../common/global-functions';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CONSTANTS } from '../../common/constants';
import { HttpClient } from "@angular/common/http";
import { ShopService } from './shop.service';
import { ModalService } from '../../_modal';
import { SnotifyService } from 'ng-snotify';
import { MapsAPILoader } from "@agm/core";
import { Router } from "@angular/router";
import * as moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  shops: any = [];
  addShopObj: any = {};
  addShopForm: any;
  shopCategories: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isContinue: boolean = false;
  isInValidPDF: boolean = false;
  isPdfLoading: boolean = false;
  isPosterLoading: boolean = false;
  isCropperLoading: boolean = false;

  weekDays: any = [];
  shopId: any = '';
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  shopImgObj: any = {};
  posterDropify: any;
  posterObj: any = {};
  dropifyOption: any = {};
  drEvent: any;

  minDateValue: any = new Date();
  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  address: string = '';
  getState: any;
  getCity: any;
  autocomplete: any;
  private geoCoder: any;
  finaLatLong: any = { lat: CONSTANTS.latitude, lng: CONSTANTS.longitude };
  map: google.maps.Map | any;
  @ViewChild('search') public searchElementRef: ElementRef | any;

  inputText: any;
  pTotal: any;
  perPageLimit: any = 4;
  offset: any = 1;
  socialLinks: any = {};
  gstPdf: any;

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _router: Router,
    private _http: HttpClient,
    private _sNotify: SnotifyService,
    private _shopService: ShopService,
    private _globalFunctions: GlobalFunctions,
    private _compressImage: CompressImageService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('eId');
    this.weekDays = [
      { value: 'su' },
      { value: 'mo' },
      { value: 'tu' },
      { value: 'we' },
      { value: 'th' },
      { value: 'fr' },
      { value: 'sr' }
    ];
    this.getOfflineShops();
    this.getShopCategories();
    this.prepareDefaultImagesAndPosterAndVideos();
    this._prepareShopForm(this.addShopObj);

    this.socialLinks = {
      facebook_link: '',
      youtube_link: '',
      twitter_link: '',
      pinterest_link: '',
      instagram_link: '',
      linkedin_link: ''
    }

    this.lat = this.addShopObj?.event_location?.latitude || CONSTANTS.latitude;
    this.lng = this.addShopObj?.event_location?.longitude || CONSTANTS.longitude;
    this._mapsAPILoader.load().then(() => {
      if (!this.addShopObj || !this.addShopObj.event_location || !this.addShopObj.event_location.latitude) {
        this._setCurrentLocation();
      }
      this.geoCoder = new google.maps.Geocoder;
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      this.autocomplete.addListener("place_changed", () => {
        this._ngZone.run(() => {
          //get the place result
          let place: any = this.autocomplete.getPlace();

          //verify result
          if (!place.geometry) {
            return;
          }
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          this.finaLatLong.lat = place.geometry.location.lat();
          this.finaLatLong.lng = place.geometry.location.lng();
        });
      });
    });
  }

  getOfflineShops(shop: any = ''): void {
    this.isLoading = true;
    const page = shop ? (shop.page + 1) : 1;
    this.perPageLimit = shop ? (shop.rows) : this.perPageLimit;
    this.offset = ((this.perPageLimit * page) - this.perPageLimit) + 1;

    const filter: any = {
      page: 1,
      limit: 10,
      search: ""
    }
    this._shopService.offlineShopList(filter).subscribe((result: any) => {
      this.pTotal = result.total;
      this.shops = result.Data.docs;
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getShopCategories(): void {
    this.isLoading = true;
    this._shopService.getShopCategories().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopCategories = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  prepareDefaultImagesAndPosterAndVideos(): void {
    if (this.shopImgObj && this.shopImgObj.image) {
      if (typeof (this.shopImgObj.image) == 'string') {
        this.savePoster(this.shopImgObj);
      } else {
        const image: any = this.shopImgObj.image;
        if (image != undefined) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.cropImgPreview = e.target.result;
          };
          reader.readAsDataURL(image);
        }
      }
    }
  }

  // Custom script loading
  customJs(src: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this._renderer.appendChild(document.body, script);
    return script;
  }

  // Get Current Location Coordinates
  private _setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        // this.zoom = 15;
      });
    }
  }

  markerDragEnd(latLong: marker, $event: any) {
    this.finaLatLong = { lat: $event.coords.lat, lng: $event.coords.lng };
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.addShopForm.patchValue({
      latitude: $event.coords.lat,
      longitude: $event.coords.lng
    });

    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = CONSTANTS.defaultMapZoom;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  addMapLocation() {
    this._http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.finaLatLong.lat},${this.finaLatLong.lng}&key=${CONSTANTS.googleMapApiKey}`).subscribe(async (res: any) => {
      let selectedState: any = {};
      if (selectedState) {
        this.getCity = selectedState.citys;
      }
      _.each(res.results[0].address_components, (address: any) => {
        _.each(address.types, (type: any) => {
          if (type == "premise" || type == "street_number") {
            this.addShopForm.get('flat_no').setValue(address.long_name);
          }
          if (type == "neighborhood") {
            this.addShopForm.get('street_name').setValue(address.long_name);
          }
          if (type == "sublocality") {
            this.addShopForm.get('area_name').setValue(address.long_name);
          }
          if (type == "administrative_area_level_1") {
            this.addShopForm.get('state').setValue(address.long_name);
          }
          if (type == "administrative_area_level_3") {
            this.addShopForm.get('city').setValue(address.long_name);
          }
          if (type == "postal_code") {
            this.addShopForm.get('pincode').setValue(address.long_name);
          }
        });
      });
      if (selectedState) {
        this.getCity = selectedState.citys;
      }
    });
  }

  get banner(): any {
    return this.addShopForm?.get('banner');
  }

  openAddEditShopDialog(event: any, shopId: string = ''): void {
    event.stopPropagation();
    this._modalService.open('shopDialog');
    this.shopId = shopId;

    this.dropifyOption = {
      messages: {
        default: 'Add Poster',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    };
    this.drEvent = $('#poster').dropify(this.dropifyOption);
    this.drEvent.on('dropify.afterClear', (event: any, element: any) => {
      this.banner?.setValue('');
    }); 
    if (this.shopId && this.shopId != '') {
      this.getOfflineShopByShopId(this.shopId);
    }
  }

  getOfflineShopByShopId(shopId: any = ''): void {
    this.isLoading = true;
    this._shopService.getOfflineShopByShopId(shopId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._prepareShopForm(result.Data);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  closeAddEditShopDialog(): void {
    this.addShopForm.reset();
    this._prepareShopForm();
    $('.dropify-clear').click();
    this._modalService.close('shopDialog');
    this.cropImgPreview = null;
    this.shopId = '';
    this.isContinue = false;
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
          this._sNotify.error('Maximum Poster Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
          return false;
        }
        this.posterObj.image = poster;
        this.posterObj.name = poster.name;
        this._modalService.open("imgCropper");
        this.isCropperLoading = true;
      }
    }
  }

  savePoster(img: any): void {
    if (img && img != '' && !this.isPosterLoading) {
      const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (compressedImage) {
          const posterFormData = new FormData();
          posterFormData.append('file', compressedImage);
          this.isPosterLoading = true;
          this._shopService.uploadBanner(posterFormData).subscribe((result: any) => {
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
    this.banner?.setValue(image);
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  isContinueClick(): void {
    if (this.addShopForm.invalid) {
      Object.keys(this.addShopForm.controls).forEach((key) => {
        this.addShopForm.controls[key].touched = true;
        this.addShopForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isContinue = true;
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
      // this._createEventService.documentUpload(pdfFormData).subscribe((result: any) => {
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

  prepareShopObj(shopObj: any): any {
    const preparedShopObj: any = this._globalFunctions.copyObject(shopObj);
    preparedShopObj.start_date = moment(shopObj.start_date).format('YYYY-MM-DD');
    preparedShopObj.end_date = moment(shopObj.end_date).format('YYYY-MM-DD');
    preparedShopObj.longitude = this.lng;
    preparedShopObj.latitude = this.lat;
    // preparedShopObj.social_media_links = this.socialLinks;
    return preparedShopObj;
  }

  addShopOffer(): any {
    if (this.addShopForm.invalid) {
      Object.keys(this.addShopForm.controls).forEach((key) => {
        this.addShopForm.controls[key].touched = true;
        this.addShopForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.isLoading) {
      return false;
    }
    this.isLoading = true;
    const preparedShopObj: any = this.prepareShopObj(this.addShopForm.value);
    this._shopService.addEditOfflineShop(preparedShopObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.getOfflineShops();
        this.closeAddEditShopDialog();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  gotoShopOverview(event: any, addShopObj: any): void {
    // event.stopPropagation();
    this._router.navigate(['/offline-shop-offers/' + addShopObj]);
  }

  onCheckboxChange(e: any): void {
    const weekDays: FormArray = this.addShopForm.get('shop_days') as FormArray;
    if (e.target.checked) {
      weekDays.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      weekDays.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          weekDays.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  private _prepareShopForm(addShopObj: any = {}): void {
    this.addShopForm = this._formBuilder.group({
      shopid: [(this.shopId && this.shopId != '') ? this.shopId : ''],
      banner: ['', [Validators.required]],
      shop_name: [addShopObj?.shop_name || '', [Validators.required]],
      shop_category: [(addShopObj.shop_category && addShopObj.shop_category != '') ? addShopObj.shop_category : '', [Validators.required]],
      shop_days: this._formBuilder.array((addShopObj.shop_days && addShopObj.shop_days.length) ? addShopObj.shop_days : [], [Validators.required]),
      start_date: [(addShopObj.start_date) ? new Date(addShopObj.start_date) : '', [Validators.required]],
      end_date: [(addShopObj.end_date) ? new Date(addShopObj.end_date) : '', [Validators.required]],
      about_shop: [addShopObj?.about_shop || ''],
      flat_no: [addShopObj?.flat_no || ''],
      street_name: [addShopObj?.street_name || ''],
      area_name: [addShopObj?.area_name || ''],
      city: [addShopObj?.city || '', [Validators.required]],
      state: [addShopObj?.state || '', [Validators.required]],
      pincode: [addShopObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      longitude: [this.lng],
      latitude: [this.lat],

      company_name: [addShopObj?.company_name || ''],
      gst_file: [''],
      contact_number: [addShopObj?.contact_number || ''],
      emailid: [addShopObj?.emailid || ''],
      about: [addShopObj?.about || '']
    });

    if (addShopObj && addShopObj.shop_days && addShopObj.shop_days.length) {
      this.weekDays = this.weekDays.map((dayObj: any) => {
        dayObj.isSelected = !!(addShopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
    }
  }

  markers: marker = {
    lat: CONSTANTS.latitude,
    lng: CONSTANTS.longitude,
    label: '',
    draggable: true
  }
}

interface marker {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
}