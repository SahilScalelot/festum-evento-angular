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
  lat: number = 0;
  lng: number = 0;
  address: string = '';
  getState: any;
  autocomplete: any;
  getCity: any;
  finaLatLong: any = {lat: CONSTANTS.latitude, lng: CONSTANTS.longitude};
  map: google.maps.Map | any;
  
  private geoCoder: any;
  @ViewChild('search') public searchElementRef: ElementRef | any;
  
  locationObj: any = {event_location: {}};
  isLoading: boolean = false;

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
    this.getLocationEvent();
    this._prepareLocationForm();    
  }

  getLocationEvent(): any {
    this.isLoading = true;
    this._createEventService.getLocation(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.event_location || {};
        this._prepareLocationForm(eventLocationObj);
        this.setLocation(eventLocationObj?.location);
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

          this.finaLatLong.lat = place.geometry.location.lat();
          this.finaLatLong.lng = place.geometry.location.lng();
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
      city: [locationObj?.city || '', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
      state: [locationObj?.state || '', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
      pincode: [locationObj?.pincode || '', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
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

  markerDragEnd($event: any) {
    this.finaLatLong = {lat: $event.coords.lat, lng: $event.coords.lng};
    this.lat = $event?.coords?.lat;
    this.lng = $event?.coords?.lng;
    this.locationForm.patchValue({
      latitude: this.lat,
      longitude: this.lng
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
          }
          if (type == "administrative_area_level_3") {
            this.locationForm.get('city').setValue(address?.long_name);
          }
          if (type == "postal_code") {
            this.locationForm.get('pincode').setValue(address?.long_name);
          }
        });
      });
      if (selectedState) {
        this.getCity = selectedState?.citys;
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
  
  next(): void {
    if (this.locationForm.invalid) {
      Object.keys(this.locationForm.controls).forEach((key) => {
        this.locationForm.controls[key].touched = true;
        this.locationForm.controls[key].markAsDirty();
      });
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
