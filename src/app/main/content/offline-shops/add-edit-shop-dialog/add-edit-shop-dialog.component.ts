import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CompressImageService } from 'src/app/services/compress-image.service';
import { GlobalFunctions } from '../../../common/global-functions';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CONSTANTS } from '../../../common/constants';
import { HttpClient } from "@angular/common/http";
import { GlobalService } from 'src/app/services/global.service';
import { OfflineShopsService } from '../offline-shops.service';
import { ModalService } from "../../../_modal";
import { SnotifyService } from 'ng-snotify';
import { MapsAPILoader } from "@agm/core";
import { Router } from "@angular/router";
import * as moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs';
declare var $: any;
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-add-edit-shop-dialog',
  templateUrl: './add-edit-shop-dialog.component.html',
  styleUrls: ['./add-edit-shop-dialog.component.scss']
})
export class AddEditShopDialogComponent implements OnInit {
  addShopForm: any;
  shopCategories: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isContinue: boolean = false;
  isInvalidPDF: boolean = false;
  isPdfLoading: boolean = false;
  isPosterLoading: boolean = false;
  isCropperLoading: boolean = false;
  
  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  weekDays: any = [
    { value: 'su' },
    { value: 'mo' },
    { value: 'tu' },
    { value: 'we' },
    { value: 'th' },
    { value: 'fr' },
    { value: 'st' }
  ];
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  shopImgObj: any = {};
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
  map: google.maps.Map | any;
  finaLatLong: any = { lat: CONSTANTS.latitude, lng: CONSTANTS.longitude };
  private geoCoder: any;

  inputText: any;
  gstPdf: any;
  socialLinks: any = {
    facebook_link: '',
    youtube_link: '',
    twitter_link: '',
    pinterest_link: '',
    instagram_link: '',
    linkedin_link: ''
  };

  @Input() shopId: any = '';
  @Input() shopObj: any = {};
  @Output() closeAddEditFormEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('search') public searchElementRef: ElementRef | any;

  get banner(): any {
    return this.addShopForm?.get('banner');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _router: Router,
    private _http: HttpClient,
    private _sNotify: SnotifyService,
    private _offlineShopsService: OfflineShopsService,
    private _globalFunctions: GlobalFunctions,
    private _compressImage: CompressImageService,
    private _modalService: ModalService,
    private _globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getShopCategories();
    setTimeout(() => {
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
    }, 0);

    this._prepareShopForm();
    this.lat = this.shopObj?.location?.coordinates[1] || CONSTANTS.latitude;
    this.lng = this.shopObj?.location?.coordinates[0] || CONSTANTS.longitude;
    this._mapsAPILoader.load().then(() => {
      if (!this.shopObj || !this.shopObj.location || !this.shopObj.location.length) {
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

    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        const businessProfile: any = this._globalFunctions.copyObject(user?.businessProfile || {});
        const companyObj: any = {
          company_name: businessProfile.name,
          contact_number: businessProfile.mobile,
          emailid: businessProfile.email,
          about: businessProfile.about,
        }
        if (!this.shopId || this.shopId == '') {
          this.addShopForm.patchValue(companyObj);
        }
      }
    });
  }
  
  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getShopCategories(): void {
    this.isLoading = true;
    this._offlineShopsService.getShopCategories().subscribe((result: any) => {
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

  getOfflineShopByShopId(shopId: any = ''): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(shopId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopObj = result.Data;
        this._prepareShopForm(result.Data);
        this.gstPdf = result.Data.companydetails.gst_file;
        this.inputText = _.last(_.split(result.Data.companydetails.gst_file, '/'));
        if (result?.Data?.banner) {
          this.setPosterInDropify(result?.Data?.banner);
        }
        this.shopObj.company_name = result?.Data?.companydetails?.company_name;
        this.shopObj.contact_number = result?.Data?.companydetails?.contact_number;
        this.shopObj.emailid = result?.Data?.companydetails?.emailid;
        this.shopObj.about = result?.Data?.companydetails?.about;
        this.socialLinks = result?.Data?.companydetails?.social_media_links;
        setTimeout(() => {
          this.lat = this.shopObj?.location?.coordinates[1] || CONSTANTS.latitude;
          this.lng = this.shopObj?.location?.coordinates[0] || CONSTANTS.longitude;
        }, 100);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  closeAddEditShopDialog(isReload: boolean = false): void {
    this.addShopForm.reset();
    this._prepareShopForm();
    $('.dropify-clear').click();
    this.cropImgPreview = null;
    this.shopId = '';
    this.isContinue = false;

    this.closeAddEditFormEvent.emit(isReload);
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

  savePoster(img: any): void {
    if (img && img != '' && !this.isPosterLoading) {
      const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (compressedImage) {
          const posterFormData = new FormData();
          posterFormData.append('file', compressedImage);
          this.isPosterLoading = true;
          this._offlineShopsService.uploadBanner(posterFormData).subscribe((result: any) => {
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

  onChangePDF(): any {
    const pdfUpload = $('#company_gst')[0].files[0];
    const pdfFormData = new FormData();
    this.isInvalidPDF = false;
    if (pdfUpload != undefined) {
      if (pdfUpload.type != 'application/pdf') {
        $('#company_gst').focus();
        this.isInvalidPDF = true;
        return false;
      }
      pdfFormData.append('file', pdfUpload);
      this.isPdfLoading = true;
      this._offlineShopsService.documentUpload(pdfFormData).subscribe((result: any) => {
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

  prepareShopObj(shopObj: any): any {
    const preparedShopObj: any = this._globalFunctions.copyObject(shopObj);
    // preparedShopObj.start_date = moment(shopObj.start_date).format('YYYY-MM-DD');
    // preparedShopObj.end_date = moment(shopObj.end_date).format('YYYY-MM-DD');
    preparedShopObj.shop_open_time = this.prepareTime(shopObj.shop_open_time);
    preparedShopObj.shop_close_time = this.prepareTime(shopObj.shop_close_time);
    preparedShopObj.longitude = this.lng;
    preparedShopObj.latitude = this.lat;
    preparedShopObj.gst_file = this.gstPdf;
    preparedShopObj.social_media_links = this.socialLinks;
    return preparedShopObj;
  }

  addEditShopOffer(): any {
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
    console.log(preparedShopObj);
    
    this._offlineShopsService.addEditOfflineShop(preparedShopObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        
        this.closeAddEditShopDialog(true);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
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
      shop_category: [(addShopObj.shop_category && addShopObj.shop_category._id) ? addShopObj.shop_category._id : '', [Validators.required]],
      shop_days: this._formBuilder.array((addShopObj.shop_days && addShopObj.shop_days.length) ? addShopObj.shop_days : [], [Validators.required]),
      start_date: [(addShopObj.start_date) ? new Date(addShopObj.start_date) : ''],
      end_date: [(addShopObj.end_date) ? new Date(addShopObj.end_date) : ''],
      shop_open_time: [addShopObj?.shop_open_time, [Validators.required]],
      shop_close_time: [addShopObj?.shop_close_time, [Validators.required]],
      about_shop: [addShopObj?.about_shop || ''],
      flat_no: [addShopObj?.flat_no || ''],
      street_name: [addShopObj?.street_name || ''],
      area_name: [addShopObj?.area_name || ''],
      city: [addShopObj?.city || '', [Validators.required]],
      state: [addShopObj?.state || '', [Validators.required]],
      pincode: [addShopObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      longitude: [this.lng],
      latitude: [this.lat],

      company_name: [addShopObj?.companydetails?.company_name || ''],
      gst_file: [this.gstPdf || ''],
      contact_number: [addShopObj?.companydetails?.contact_number || ''],
      emailid: [addShopObj?.companydetails?.emailid || ''],
      about: [addShopObj?.companydetails?.about || '']
    });

    if (addShopObj && addShopObj.shop_days && addShopObj.shop_days.length) {
      this.weekDays = this.weekDays.map((dayObj: any) => {
        dayObj.isSelected = (addShopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
    }
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return moment(dateWithTime).format('HH') + ':' + moment(dateWithTime).format('mm');
    }
    return dateWithTime;
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