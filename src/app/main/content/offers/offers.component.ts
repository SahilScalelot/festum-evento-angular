import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild, EventEmitter, Input, Output} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { ModalService } from '../../_modal';
import { CONSTANTS } from '../../common/constants';
import { ImageCroppedEvent } from 'ngx-image-cropper';
declare var $: any;

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  addShopForm: any;
  weekdays: any = ['su','mo','tu','we','th','fr','sr'];
  addShopObj: any = {};
  isContinue: boolean = false;

  imgChangeEvt: any = '';  
  cropImgPreview: any = '';
  shopImgObj: any = {};

  constants: any = CONSTANTS;
  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  address: string = '';
  getState: any;
  getCity: any;
  autocomplete: any;
  private geoCoder: any;
  finaLatLong: any = {lat: CONSTANTS.latitude, lng: CONSTANTS.longitude};
  map: google.maps.Map | any;
  @ViewChild('search') public searchElementRef: ElementRef | any;


  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _router: Router,
    private _http: HttpClient,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    
    this.prepareDefaultImagesAndPosterAndVideos();
    this._prepareAddShopForm(this.addShopObj);
    
    this.lat = this.addShopObj?.event_location?.latitude || CONSTANTS.latitude;
    this.lng = this.addShopObj?.event_location?.longitude || CONSTANTS.longitude;
    // this.prepareEventObj();

    // this.customJs('assets/js/form-wizard.js').onload = () => {
    // };
    this._mapsAPILoader.load().then(() => {
      if (!this.addShopObj || !this.addShopObj.event_location || !this.addShopObj.event_location.latitude) {
        this._setCurrentLocation();
      }
      this.geoCoder = new google.maps.Geocoder;
      // this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      // this.autocomplete.addListener("place_changed", () => {
      //   this._ngZone.run(() => {
      //     //get the place result
      //     let place: any = this.autocomplete.getPlace();

      //     //verify result
      //     if (!place.geometry) {
      //       return;
      //     }
      //     //set latitude, longitude and zoom
      //     this.lat = place.geometry.location.lat();
      //     this.lng = place.geometry.location.lng();

      //     this.finaLatLong.lat = place.geometry.location.lat();
      //     this.finaLatLong.lng = place.geometry.location.lng();
      //   });
      // });
    });
  }


  async onFileChange(event: any, key = 0) {
    if (event) {
      this.imgChangeEvt = event;
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.shopImgObj.image = file;
        this.shopImgObj.name = file.name;
        this._modalService.open("imgCropper");
      } else {
        this.cropImgPreview = '';
      }      
    }
  }

  savePoster(img: any) {
    this.shopImgObj.image = img;
    // console.log($('#posterUpload').find('.dropify-render').find('.dropify-render').find('img'));
    $('#shopimgobj').find('.dropify-preview').find('.dropify-render').find('img').attr("src", img);
    this._modalService.close("imgCropper");
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  prepareDefaultImagesAndPosterAndVideos(): void {
    if (this.shopImgObj && this.shopImgObj.image) {
      if (typeof(this.shopImgObj.image) == 'string') {
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
    this.finaLatLong = {lat: $event.coords.lat, lng: $event.coords.lng};
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.addShopForm.patchValue({
      latitude: $event.coords.lat,
      longitude: $event.coords.lng
    });
    
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({'location': {lat: latitude, lng: longitude}}, (results: any, status: any) => {
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
      _.each(res.results[0].address_components, (address) => {
        _.each(address.types, (type) => {0
          if (type == "premise" || type == "street_number") {
            this.addShopForm.get('flat_number').setValue(address.long_name);
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
          // if (type == "administrative_area_level_3") {
          //   this.addShopForm.get('address').setValue(address.long_name);
          // }
          // if (type == "plus_code" || type == "locality" || type == "political") {
          //   this.addShopForm.get('address').setValue(address.long_name);
          // }
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

  mapClicked($event: any) {
    // console.log($event)
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }
  popupOpen(popId: string){
    this._modalService.open(popId);
    $('.shopimgobj').dropify({
      messages: {
        default: 'Add Image',
        icon: '<svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6666 0.333496H1.33335C0.59702 0.333496 0 0.930479 0 1.66681V15.3335C0 16.0698 0.59702 16.6668 1.33335 16.6668H19.6666C20.403 16.6668 21 16.0698 21 15.3335V1.66681C21 0.930479 20.403 0.333496 19.6666 0.333496ZM19.6666 1.66681V11.3638L17.0389 8.9748C16.644 8.61581 16.0366 8.63014 15.6593 9.00782L12.9999 11.6668L7.75634 5.40347C7.35998 4.93013 6.63397 4.92548 6.23167 5.39314L1.33335 11.0858V1.66681H19.6666ZM14 5.16682C14 4.15414 14.8206 3.33347 15.8333 3.33347C16.846 3.33347 17.6666 4.15414 17.6666 5.16682C17.6666 6.17949 16.846 7.00012 15.8333 7.00012C14.8206 7.00016 14 6.17949 14 5.16682Z" fill="#A6A6A6"/></svg>',
      }
    });
  }

  popClose(popId: string){
    this.addShopForm.reset();
    this._modalService.close(popId);
    this.isContinue = false;
  }

  isContinueClick(): void{
    if (this.addShopForm.invalid) {
      // this.addShopForm.controls.markAsDirty();
      Object.keys(this.addShopForm.controls).forEach((key) => {
        this.addShopForm.controls[key].touched = true;
        this.addShopForm.controls[key].markAsDirty();
      });
      return;
    }
    this.isContinue = true;
  }

  addshopoffer(): void {
    console.log(this.addShopForm.value);
    
  }

  gotoEventOverview(event: any, addShopObj: any): void {
    // event.stopPropagation();
    this._router.navigate(['/offline-shop-offers/' + addShopObj]);
  }

  onCheckboxChange(e: any): void {
    const weekdays: FormArray = this.addShopForm.get('weekdays') as FormArray;
    if (e.target.checked) {
      weekdays.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      weekdays.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          weekdays.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  private _prepareAddShopForm(addShopObj: any = {}): void {
    this.addShopForm = this._formBuilder.group({
      shop_image: ['', [Validators.required]],
      shop_name: [addShopObj.shop_name, [Validators.required]],
      shop_category: [addShopObj.shop_category, [Validators.required]],
      weekdays: this._formBuilder.array([], [Validators.required]),
      start_date: [addShopObj.start_date, [Validators.required]],
      end_date: [addShopObj.end_date, [Validators.required]],
      about_us: [addShopObj.about_us, [Validators.required]],

      flat_number: [addShopObj.flat_number],
      street_name: [addShopObj.street_name],
      area_name: [addShopObj.area_name],
      city: [addShopObj.city, [Validators.required]],
      state: [addShopObj.state, [Validators.required]],
      pincode: [addShopObj.pincode, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],

      company_name: [addShopObj.company_name, [Validators.required]],
      upload_pdf: [''],
      company_contact_number: [addShopObj.company_contact_number, [Validators.required]],
      company_email: [addShopObj.company_email, [Validators.required]],
      about_our_company: [addShopObj.about_our_company, [Validators.required]],
      facebook_link: [addShopObj.facebook_link],
      youtube_link: [addShopObj.youtube_link],
      twitter_link: [addShopObj.twitter_link],
      pinterest_link: [addShopObj.pinterest_link],
      instagram_link: [addShopObj.instagram_link],
      linkedin_link: [addShopObj.linkedin_link],
    });
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