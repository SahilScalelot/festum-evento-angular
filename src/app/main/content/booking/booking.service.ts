import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }
  
  getBookings(filterObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/bookings', filterObj, this._globalFunctions.getAuthorizationHeader());
  }

}
