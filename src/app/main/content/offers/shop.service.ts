import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

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

  // Add Edit Shop
  addEditOfflineShop(shopObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/shops/save', shopObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Banner Api
  uploadBanner(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/banner', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  getOfflineShopByShopId(shopId: any): any {
    return this.http.post(environment.appURL + 'organizer/shops/getone', { shopid: shopId }, this._globalFunctions.getAuthorizationHeader());
  }

  // retrieveUser(): any {
  //   return this.http.get(environment.appURL + 'events/', this._globalFunctions.getAuthorizationHeader());
  // }
}
