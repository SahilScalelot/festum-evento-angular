import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class OfflineShopsService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  getShopCategories(shopCategoryObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/shopcategories/list', shopCategoryObj, this._globalFunctions.getAuthorizationHeader());
  }

  // retrieveEvents(limit:any, page: any): any {
  //   return this.http.get(environment.appURL + 'events/' + '?limit='+ limit +'&page=' + page, this._globalFunctions.getAuthorizationHeader());
  // }

  // Offline Shop List
  offlineShopList(filter: any): any {
    return this.http.post(environment.appURL + 'organizer/shops', filter, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Get Shop By Id
  getOfflineShopByShopId(shopId: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/getone', { shopid: shopId }, this._globalFunctions.getAuthorizationHeader());
  }

  // Add Edit Shop
  addEditOfflineShop(shopObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/shops/save', shopObj, this._globalFunctions.getAuthorizationHeader());
  }
  // Upload Offline Offer's Poster, Image, Video
//   /shop/banner
// /shop/document
// /shop/image
// /shop/video

  // Banner Upload Api
  uploadBanner(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/banner', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Document Upload Api
  documentUpload(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/document', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  //Image Upload Api
  uploadshopImage(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/image', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  //Video Upload Api
  uploadshopVideo(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/video', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }


  // Offline Shop Offer List
  offlineShopOfferList(filter: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer', filter, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Offline Shop Offer List
  getOfflineOffer(offerObj: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/getone', offerObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Offline Shop Offer Attendees
  getAttendeesByEventId(offerObj: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/attendees', offerObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Save Offline Offer
  saveOfflineOffer(shopObj: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/save', shopObj, this._globalFunctions.getAuthorizationHeader());
  }
  // Save Offline Offer
  removeOfflineShop(shopId: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/remove', {shopid: shopId}, this._globalFunctions.getAuthorizationHeader());
  }
  // Save Offline Offer
  removeOfflineOffer(shopObj: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/remove', {shopid: shopObj.shopid, offlineofferid: shopObj._id}, this._globalFunctions.getAuthorizationHeader());
  }

  // Upload Offline Offer's Poster, Image, Video
  uploadPoster(posterFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/banner', posterFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
  uploadVideo(videoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/video', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
  uploadImage(imageFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/image', imageFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Export Attendees
  exportAttendees(offerIdObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/offlineoffer/exportattendees', offerIdObj, this._globalFunctions.getAuthorizationHeader());
  }
}
