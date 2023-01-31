import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }
  
  getInTouch(getInTouchObj: any = {}): any {
    return this.http.post(environment.appURL + 'landing/getintouch', getInTouchObj, this._globalFunctions.getHeader());
  }
  
  getUpcomingEvents(): any {
    return this.http.get(environment.appURL + 'landing/events/upcoming', this._globalFunctions.getAuthorizationHeader());
  }
  
  getUpcomingOffers(): any {
    return this.http.get(environment.appURL + 'landing/offers/upcoming', this._globalFunctions.getAuthorizationHeader());
  }
  
  getUpcomingStreams(): any {
    return this.http.get(environment.appURL + 'landing/livestreams/upcoming', this._globalFunctions.getAuthorizationHeader());
  }


}
