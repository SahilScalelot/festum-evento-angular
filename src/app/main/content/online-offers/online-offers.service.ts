import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class OnlineOffersService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Online Offers List Api
  onlineOffersList(pageLimit: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer', pageLimit, this._globalFunctions.getAuthorizationHeader());
  }

  // Create Online Offer Api
  createOnlineOffer(offerObj: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/save', offerObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Online Offer By Id Api
  getOnlineOfferById(offerId: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/getone', offerId, this._globalFunctions.getAuthorizationHeader());
  }

  // Banner Upload Api
  uploadBanner(bannerFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/banner', bannerFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Image Upload Api
  imageUpload(imageFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/image', imageFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Video Upload Api
  videoUpload(videoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/video', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
}
