import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";
declare var $: any;
@Component({
  selector: 'app-add-edit-shop-dialog',
  templateUrl: './add-edit-shop-dialog.component.html',
  styleUrls: ['./add-edit-shop-dialog.component.scss']
})
export class AddEditShopDialogComponent implements OnInit, OnDestroy {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  PhoneNumberFormat = PhoneNumberFormat;
  // phoneForm: any;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined),
  });
  @ViewChild('phoneF') form: any;

  addShopForm: any;
  shopCategories: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isContinue: boolean = false;
  isInvalidPDF: boolean = false;
  isPdfLoading: boolean = false;
  isPosterLoading: boolean = false;
  isCropperLoading: boolean = false;
  successfully: boolean = false;

  detailEditor = DecoupledEditor;
  editorConfig: any = {};

  weekDays: any = [
    { value: 'su', label: 'Sun' },
    { value: 'mo', label: 'Mon' },
    { value: 'tu', label: 'Tue' },
    { value: 'we', label: 'Wed' },
    { value: 'th', label: 'Thu' },
    { value: 'fr', label: 'Fri' },
    { value: 'st', label: 'Sat' }
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
  tmpLocationObj: any = {};

  get isValidCity(): any {
    return this.addShopForm.get('city')?.valid && this.addShopForm.get('city')?.dirty && this.addShopForm.get('city')?.touched && this.tmpLocationObj.city && this.addShopForm.value.city != this.tmpLocationObj.city;
  }
  get isValidState(): any {
    return this.addShopForm.get('state')?.valid && this.addShopForm.get('state')?.dirty && this.addShopForm.get('state')?.touched && this.tmpLocationObj.state && this.addShopForm.value.state != this.tmpLocationObj.state;
  }
  get isValidPinCode(): any {
    return this.addShopForm.get('pincode')?.valid && this.addShopForm.get('pincode')?.dirty && this.addShopForm.get('pincode')?.touched && this.tmpLocationObj.pincode && this.addShopForm.value.pincode != this.tmpLocationObj.pincode;
  }

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
  isCotegoryesLoading: any;

  pincodeValidationObj: any = '';

  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimit: any = 0;

  textEditorTac: boolean = false;
  textEditorMaxLimitTac: any = this.constants.CKEditorCharacterLimit1;
  textEditorLimitTac: any = 0;

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
  ) {
    this.pincodeValidation = _.debounce(this.pincodeValidation, 1000)
  }

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
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          this.finaLatLong.lat = place.geometry.location.lat();
          this.finaLatLong.lng = place.geometry.location.lng();
          this.addMapLocation();
          this.markerDragEnd(this.markers, {}, true);
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

  pincodeValidation(pincode: any = ''): any {
    if (pincode && pincode != '') {
      this.isLoading = true;
      this._globalService.pincodeValidation(pincode).subscribe((result: any) => {
        if (result && result[0] && result[0].Status) {
          const formName = this.addShopForm;
          if (result[0].Status == 'Success') {
            this.pincodeValidationObj = result[0].PostOffice[0];
            const companyFormValueObj = formName?.value || {};

            formName.markAsTouched();
            formName?.get('city')?.markAsTouched();
            formName?.get('state')?.markAsTouched();
            formName?.get('pincode')?.markAsTouched();
            formName?.controls['city']?.markAsDirty();
            formName?.controls['state']?.markAsDirty();
            formName?.controls['pincode']?.markAsDirty();

            formName?.controls['city']?.setErrors((this.pincodeValidationObj?.District && companyFormValueObj?.city && (this.pincodeValidationObj.District).toLowerCase() != (companyFormValueObj?.city).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['state']?.setErrors((this.pincodeValidationObj?.State && companyFormValueObj?.state && (this.pincodeValidationObj.State).toLowerCase() != (companyFormValueObj?.state).toLowerCase()) ? { 'not_match': true } : null);
            formName?.controls['pincode']?.setErrors((this.pincodeValidationObj?.Pincode && companyFormValueObj?.pincode && this.pincodeValidationObj.Pincode != companyFormValueObj?.pincode) ? { 'not_match': true } : null);
            
            formName.get('state').setValue(result[0]?.PostOffice[0]?.State);
            formName.get('city').setValue(result[0]?.PostOffice[0]?.District);
            this.isLoading = false;
          } else if (result[0].Status == 'Error') {
            formName?.controls['pincode']?.setErrors({ 'pattern': true });
            this.isLoading = false;
          }
        }
      }, (error: any) => {
        this.isLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }

  getShopCategories(): void {
    this.isLoading = true;
    this._offlineShopsService.getShopCategories().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        
        
        this.shopCategories = [];
        let otherObj: any = {};
        result.Data.forEach((element: any) => {
          if (element.categoryname == 'Other') {
            otherObj = element;
          } else {
            this.shopCategories.push(element);
          }
        });
        if (otherObj && otherObj._id) {
          this.shopCategories.push(otherObj);
        }
        this.isCotegoryesLoading = false;



        // this.shopCategories = result.Data;
        if (this.shopCategories && this.shopCategories.country_wise_contact && this.shopCategories.country_wise_contact != '') { 
          this.phoneForm.patchValue({
            phone: this.shopCategories.country_wise_contact
          });
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

  markerDragEnd(latLong: marker, $event: any, isWithoutCheckLatLong: boolean = false) {
  // markerDragEnd($event: any, isWithoutCheckLatLong: boolean = false) {
    if (!isWithoutCheckLatLong) {
      this.lat = $event?.coords?.lat;
      this.lng = $event?.coords?.lng;
    }
    this.finaLatLong = { lat: $event.coords.lat, lng: $event.coords.lng };
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.addShopForm.patchValue({
      latitude: $event.coords.lat,
      longitude: $event.coords.lng
    });

    this.getAddress(this.lat, this.lng);
    this.addMapLocation();
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

  clickedMarker(label: string) {
    // console.log(`clicked the marker: ${label}`)
  }

  ngOnDestroy(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
  }

  mapClicked(markers: marker,event: any) {
    this.markerDragEnd(markers, event);
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
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

        this.phoneForm.patchValue({
          phone: this.shopObj.contact_number
        });
        
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

  closeEditShopDialog(isReload: boolean = false): void {
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

      // if (this.shopId && this.shopId != '') {
      //   this.getOfflineShopByShopId(this.shopId);
      // }
      this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
        if (result?.Data?.banner) {
          this.setPosterInDropify(result?.Data?.banner);
        }
      })
    }, 0);
    this.isContinue = false;
    // this.closeAddEditFormEvent.emit(isReload==true)
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
        this.savePoster(poster);
        // this._modalService.open("imgCropper");
        // this.isCropperLoading = true;
      }
    }
  }

  savePoster(img: any): void {
    if (img && img != '' && !this.isPosterLoading) {
      // const preparedPoserFromBaseType: any = this._globalFunctions.base64ToImage(img, this.posterObj.name);
      // this._compressImage.compress(preparedPoserFromBaseType).pipe(take(1)).subscribe((compressedImage: any) => {
        if (img) {
          const posterFormData = new FormData();
          posterFormData.append('file', img);
          this.isPosterLoading = true;
          this._offlineShopsService.uploadBanner(posterFormData).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.posterObj.image = img;
              this.setPosterInDropify(result.Data.url);
              this._sNotify.success('File Uploaded Successfully.', 'Success');
              this.isPosterLoading = false;
              // this._modalService.close("imgCropper");
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

    this.editorCharacterSet();
    if (this.textEditorLimit && this.textEditorMaxLimit && this.textEditorLimit > this.textEditorMaxLimit) {
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

  editorCharacterSet(): any {
    const textfield = this.addShopForm?.get('about_shop')?.value;
    const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
    this.textEditorLimit = stringOfCKEditor.length;
    this.textEditor = (stringOfCKEditor.length > this.textEditorMaxLimit);
  }
  editorCharacterSetTac(): any {
    const textfield = this.addShopForm?.get('about')?.value;
    const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
    this.textEditorLimitTac = stringOfCKEditor.length;
    this.textEditorTac = (stringOfCKEditor.length > this.textEditorMaxLimitTac);
  }

  prepareShopObj(shopObj: any): any {
    const preparedShopObj: any = this._globalFunctions.copyObject(shopObj);
    preparedShopObj.shop_open_time = this.prepareTime(moment(shopObj.shop_open_time, 'hh:mm a'));
    preparedShopObj.shop_close_time = this.prepareTime(moment(shopObj.shop_close_time, 'hh:mm a'));
    preparedShopObj.longitude = this.lng;
    preparedShopObj.latitude = this.lat;
    preparedShopObj.gst_file = this.gstPdf;
    preparedShopObj.social_media_links = this.socialLinks;
    preparedShopObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedShopObj.dial_code = preparedShopObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedShopObj.country_wise_contact?.e164Number || '';
    preparedShopObj.contact_number = contactNumber.replace(preparedShopObj.dial_code, '') || '';
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
    this.editorCharacterSetTac();
    if (this.textEditorLimitTac && this.textEditorMaxLimitTac && this.textEditorLimitTac > this.textEditorMaxLimitTac) {
      return;
    }
    if (this.phoneForm.invalid) {
      this.form.form.controls['phone'].touched = true;
      this.phoneForm.controls['phone'].markAsDirty();
      return;
    }
    this.isLoading = true;
    
    const preparedShopObj: any = this.prepareShopObj(this.addShopForm.value);    
    this._offlineShopsService.addEditOfflineShop(preparedShopObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.successfully = true;
        setTimeout(() => {
          this.successfully = false;
          this.closeAddEditShopDialog(true);
        }, 3000);
        // this._sNotify.success('Shop Created And Update Successfully.', 'Success');
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
      banner: [addShopObj?.banner || '', [Validators.required]],
      shop_name: [addShopObj?.shop_name || '', [Validators.required]],
      shop_category: [(addShopObj.shop_category && addShopObj.shop_category._id) ? addShopObj.shop_category._id : '', [Validators.required]],
      shop_days: this._formBuilder.array((addShopObj.shop_days && addShopObj.shop_days.length) ? addShopObj.shop_days : [], [Validators.required]),
      // start_date: [(addShopObj.start_date) ? new Date(addShopObj.start_date) : ''],
      // end_date: [(addShopObj.end_date) ? new Date(addShopObj.end_date) : ''],
      shop_open_time: [(addShopObj?.shop_open_time) ? moment(addShopObj?.shop_open_time, 'hh:mm').format('hh:mm a') : '', [Validators.required]],
      shop_close_time: [(addShopObj?.shop_close_time) ? moment(addShopObj?.shop_close_time, 'hh:mm').format('hh:mm a') : '', [Validators.required]],
      about_shop: [addShopObj?.about_shop || ''],
      flat_no: [addShopObj?.flat_no || ''],
      street_name: [addShopObj?.street_name || ''],
      area_name: [addShopObj?.area_name || ''],
      city: [addShopObj?.city || '', [Validators.required]],
      state: [addShopObj?.state || '', [Validators.required]],
      pincode: [addShopObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      manual_address: [addShopObj?.manual_address || ''],
      longitude: [this.lng],
      latitude: [this.lat],

      company_name: [addShopObj?.companydetails?.company_name || ''],
      gst_file: [this.gstPdf || ''],
      contact_number: [addShopObj?.companydetails?.contact_number || ''],
      emailid: [addShopObj?.companydetails?.emailid || '',[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about: [addShopObj?.companydetails?.about || '']
    });

    if (addShopObj?.about_shop) {
      this.editorCharacterSet();
    }
    if (addShopObj?.about) {
      this.editorCharacterSetTac();
    }

    if (addShopObj && addShopObj.shop_days && addShopObj.shop_days.length) {
      this.weekDays = this.weekDays.map((dayObj: any) => {
        dayObj.isSelected = (addShopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
    }
    this.pincodeValidation(this.addShopForm.value.pincode);
  }
  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    preparedObj.country_wise_contact = this.phoneForm?.value?.phone || undefined;
    preparedObj.dial_code = preparedObj.country_wise_contact?.dialCode || '';
    const contactNumber = preparedObj.country_wise_contact?.e164Number || '';
    preparedObj.contact_no = contactNumber.replace(preparedObj.dial_code, '') || '';
    return preparedObj;
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return date.getHours() + ':' + date.getMinutes();
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