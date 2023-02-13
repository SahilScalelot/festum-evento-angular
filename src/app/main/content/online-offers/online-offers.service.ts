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
    return this.http.post(environment.appURL + 'organizer/onlineoffer/getone', {onlineofferid: offerId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Online Offer By Id Api
  removeOnlineOfferById(offerId: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/remove', {onlineofferid: offerId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Banner Upload Api
  uploadDocument(documentFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/document', documentFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Banner Upload Api
  uploadBanner(bannerFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/banner', bannerFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Image Upload Api
  imageUpload(imageFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/image', imageFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Platform Apis
  getPlatformList(): any {
    return this.http.get(environment.appURL + 'organizer/platform/list', this._globalFunctions.getAuthorizationHeader());
  }

  uploadPlatformImage(imageFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/platform/image', imageFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  savePlatform(platformObj: any): any {
    return this.http.post(environment.appURL + 'organizer/platform/save', platformObj, this._globalFunctions.getAuthorizationHeader());
  }

  linkPlatform(platformObj: any): any {
    return this.http.post(environment.appURL + 'landing/onlineoffer/click', platformObj, this._globalFunctions.getAuthorizationHeader());
  }
}
