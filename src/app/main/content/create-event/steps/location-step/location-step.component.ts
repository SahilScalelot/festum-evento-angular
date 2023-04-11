import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild, EventEmitter, Input, Output} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {ModalService} from "../../../../_modal";
import {HttpClient} from "@angular/common/http";
import {CONSTANTS} from "../../../../common/constants";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import {CreateEventService} from "../../create-event.service";
import { GlobalFunctions } from 'src/app/main/common/global-functions';

@Component({
  selector: 'app-location-step',
  templateUrl: './location-step.component.html',
  styleUrls: ['./location-step.component.scss']
})
export class LocationStepComponent implements OnInit {
  eventId: any;
  locationForm: any;
  constants: any = CONSTANTS;
  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = CONSTANTS.latitude;
  lng: number = CONSTANTS.longitude;
  address: string = '';
  getState: any;
  autocomplete: any;
  tmpLocationObj: any = {};
  map: google.maps.Map | any;
  locationObj: any = {event_location: {}};
  isLoading: boolean = false;
  isLocationLoading: boolean = false;

  private geoCoder: any;
  @ViewChild('search') public searchElementRef: ElementRef | any;

  get isValidCity(): any {
    return this.locationForm.get('city')?.valid && this.locationForm.get('city')?.dirty && this.locationForm.get('city')?.touched && this.tmpLocationObj.city && this.locationForm.value.city != this.tmpLocationObj.city;
    // this.rateCardForm.get('MediaType').invalid && (this.rateCardModel.israteCardFormSubmitted || this.rateCardForm.get('MediaType').dirty || this.rateCardForm.get('MediaType').touched);
  }
  get isValidState(): any {
    return this.locationForm.get('state')?.valid && this.locationForm.get('state')?.dirty && this.locationForm.get('state')?.touched && this.tmpLocationObj.state && this.locationForm.value.state != this.tmpLocationObj.state;
  }
  get isValidPinCode(): any {
    return this.locationForm.get('pincode')?.valid && this.locationForm.get('pincode')?.dirty && this.locationForm.get('pincode')?.touched && this.tmpLocationObj.pincode && this.locationForm.value.pincode != this.tmpLocationObj.pincode;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _modalService: ModalService,
    private _router: Router,
    private _http: HttpClient,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
  ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this._prepareLocationForm();
    this.getLocationEvent();
  }

  getLocationEvent(): any {
    this.isLoading = true;
    this._createEventService.getLocation(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.event_location || {};
        this._prepareLocationForm(eventLocationObj);
        this.setLocation(eventLocationObj?.location);
        this.tmpLocationObj.state = eventLocationObj.state;
        this.tmpLocationObj.city = eventLocationObj.city;
        this.tmpLocationObj.pincode = eventLocationObj.pincode;
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

  setLocation(locationCoordinates: any = {}): void {
    this.lng = (locationCoordinates && locationCoordinates.coordinates && locationCoordinates.coordinates.length) ? locationCoordinates?.coordinates[0] : CONSTANTS.longitude;
    this.lat = (locationCoordinates && locationCoordinates.coordinates && locationCoordinates.coordinates.length) ? locationCoordinates?.coordinates[1] : CONSTANTS.latitude;

    // this.customJs('assets/js/form-wizard.js').onload = () => {
    // };
    this._mapsAPILoader.load().then(() => {
      if (!locationCoordinates || !locationCoordinates.coordinates || !locationCoordinates.coordinates.length) {
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
          this.addMapLocation();
          this.markerDragEnd({}, true);
        });
      });
    });
  }

  private _prepareLocationForm(locationObj: any = {}): void {
    this.locationForm = this._formBuilder.group({
      flat_number: [locationObj?.flat_no || ''],
      street_name: [locationObj?.street_name || ''],
      area_name: [locationObj?.area_name || ''],
      longitude: [(locationObj && locationObj.location && locationObj.location.coordinates && locationObj.location.coordinates.length) ? locationObj.location.coordinates[0] : CONSTANTS.longitude],
      latitude: [(locationObj && locationObj.location && locationObj.location.coordinates && locationObj.location.coordinates.length) ? locationObj.location.coordinates[1] : CONSTANTS.latitude],
      city: [locationObj?.city || '', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      state: [locationObj?.state || '', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      pincode: [locationObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
      manual_address:[locationObj?.manual_address || '']
    });
  }

  // Custom script loading
  // customJs(src: string): HTMLScriptElement {
  //   const script = document.createElement("script");
  //   script.type = 'text/javascript';
  //   script.src = src;
  //   script.async = true;
  //   script.defer = true;
  //   this._renderer.appendChild(document.body, script);
  //   return script;
  // }

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

  markerDragEnd($event: any, isWithoutCheckLatLong: boolean = false) {
    if (!isWithoutCheckLatLong) {
      this.lat = $event?.coords?.lat;
      this.lng = $event?.coords?.lng;
    }
    this.locationForm.patchValue({
      latitude: this.lat,
      longitude: this.lng
    });
    
    this.getAddress(this.lat, this.lng);
    this.addMapLocation();
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
    this.isLocationLoading = true;
    this._globalService.getLocationByLatLong({ lat: this.lat, lng: this.lng }).subscribe(async (res: any) => {
      _.each(res.results[0].address_components, (address) => {
        _.each(address.types, (type) => {
          if (type == "premise" || type == "street_number") {
            this.locationForm.get('flat_number').setValue(address?.long_name);
          }
          if (type == "neighborhood") {
            this.locationForm.get('street_name').setValue(address?.long_name);
          }
          if (type == "sublocality") {
            this.locationForm.get('area_name').setValue(address?.long_name);
          }
          if (type == "administrative_area_level_1") {
            this.locationForm.get('state').setValue(address?.long_name);
            this.tmpLocationObj.state = address?.long_name;
          }
          if (type == "administrative_area_level_3") {
            this.locationForm.get('city').setValue(address?.long_name);
            this.tmpLocationObj.city = address?.long_name;
          }
          if (type == "postal_code") {
            this.locationForm.get('pincode').setValue(address?.long_name);
            this.tmpLocationObj.pincode = address?.long_name;
          }
        });
      });
      this.isLocationLoading = false;
    }, (error: any) => {
      this.isLocationLoading = false;
    });
  }

  clickedMarker(label: string) {
    // console.log(`clicked the marker: ${label}`)
  }

  mapClicked(event: any) {
    this.markerDragEnd(event);
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }

  validateLocationForm(): boolean {
    if (this.locationForm.invalid) {
      Object.keys(this.locationForm.controls).forEach((key) => {
        this.locationForm.controls[key].touched = true;
        this.locationForm.controls[key].markAsDirty();
      });
      return false;
    }
    return !((this.tmpLocationObj.state && this.locationForm.value.state != this.tmpLocationObj.state) ||
        (this.tmpLocationObj.city && this.locationForm.value.city != this.tmpLocationObj.city) ||
        (this.tmpLocationObj.pincode && this.locationForm.value.pincode != this.tmpLocationObj.pincode));
  }
  
  next(): void {
    if (!this.validateLocationForm()) {
      return;
    }
    this.isLoading = true;
    this.locationForm.disable();
    const preparedLocationObj: any = this.prepareLocationEventObj(this.locationForm.value);
    this._createEventService.location(preparedLocationObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this.locationForm.enable();
        this._router.navigate(['/events/create/photos-and-videos']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.locationForm.enable();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.locationForm.enable();
    });
  }

  prepareLocationEventObj(locationObj: any = {}): any {
    const preparedLocationEventObj: any = locationObj;
    preparedLocationEventObj.eventid = this.eventId;
    preparedLocationEventObj.flat_no = locationObj.flat_number;
    preparedLocationEventObj.longitude = locationObj.longitude;
    preparedLocationEventObj.latitude = locationObj.latitude;
    return preparedLocationEventObj;
  }

  onBackButtonClick(): void {
    // this._createEventService.isOpenAddEditArrangementDialog$.next(false);
  }

  // mapDragged($event: any) {
  //   this.lat = $event.lat;
  //   this.lng = $event.lng;
  // }

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