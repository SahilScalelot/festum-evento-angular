import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {ModalService} from "../../../../_modal";
import {HttpClient} from "@angular/common/http";
import {CONSTANTS} from "../../../../common/constants";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-location-step',
  templateUrl: './location-step.component.html',
  styleUrls: ['./location-step.component.scss']
})
export class LocationStepComponent implements OnInit {
  locationForm: any;
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
    private _formBuilder: FormBuilder,
    private renderer: Renderer2,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _modalService: ModalService,
    private router: Router,
    private _http: HttpClient,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit(): void {
    this.locationForm = this._formBuilder.group({
      flat_number: [null],
      street_name: [null],
      area_name: [null],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      pincode: [null, [Validators.required, Validators.maxLength(6)]],
    });

    // this.customJs('assets/js/form-wizard.js').onload = () => {
    // };
    this.mapsAPILoader.load().then(() => {
      this._setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      this.autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
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

  // Custom script loading
  customJs(src: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
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
            this.locationForm.get('flat_number').setValue(address.long_name);
          }
          if (type == "neighborhood") {
            this.locationForm.get('street_name').setValue(address.long_name);
          }
          if (type == "sublocality") {
            this.locationForm.get('area_name').setValue(address.long_name);
          }
          if (type == "administrative_area_level_1") {
            this.locationForm.get('state').setValue(address.long_name);
          }
          if (type == "administrative_area_level_2") {
            this.locationForm.get('city').setValue(address.long_name);
          }
          if (type == "administrative_area_level_3") {
            this.locationForm.get('address').setValue(address.long_name);
          }
          // if (type == "plus_code" || type == "locality" || type == "political") {
          //   this.locationForm.get('address').setValue(address.long_name);
          // }
          if (type == "postal_code") {
            this.locationForm.get('pincode').setValue(address.long_name);
          }
        });
      });
      if (selectedState) {
        this.getCity = selectedState.citys;
      }
      this._modalService.close("google-map");
    });
    this._modalService.close("google-map");
  }

  googleMap() {
    this._modalService.open('google-map');
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

  validate(): boolean {
    if (!this.locationForm.value.city || this.locationForm.value.city === "") {
      this._sNotify.error('City is required!', 'Oops!');
      return false;
    }
    if (!this.locationForm.value.state || this.locationForm.value.state === "") {
      this._sNotify.error('State is required!', 'Oops!');
      return false;
    }
    if (!this.locationForm.value.pincode || this.locationForm.value.pincode === "") {
      this._sNotify.error('Pincode is required!', 'Oops!');
      return false;
    }
    return true;
  }

  submitLocation() {
    if (!this.validate()) {
      return;
    }
    console.log(this.locationForm.value);
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
