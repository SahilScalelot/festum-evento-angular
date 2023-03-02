import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {CONSTANTS} from "../main/common/constants";

@Injectable()
export class GlobalService {
  public loginUser$: BehaviorSubject<any>;
  public addEditEvent$: BehaviorSubject<any>;
  public promoteNotification$: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.loginUser$ = new BehaviorSubject<any>(null);
    this.addEditEvent$ = new BehaviorSubject<any>(null);
    this.promoteNotification$ = new BehaviorSubject<any>(null);
  }

  // Location Api
  getLocationByLatLong(latLongObj: any): any {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLongObj.lat},${latLongObj.lng}&key=${CONSTANTS.googleMapApiKey}`);
  }
  
  // Delete Event
  pincodeValidation(pin: any): any {
    return this.http.get('https://api.postalpincode.in/pincode/' + pin);
  }
}
