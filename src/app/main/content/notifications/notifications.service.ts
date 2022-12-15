import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalFunctions} from "../../common/global-functions";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Notification List Api
  onlineOffersList(pageLimit: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer', pageLimit, this._globalFunctions.getAuthorizationHeader());
  }

  // Create Notification Api
  createOnlineOffer(offerObj: any): any {
    return this.http.post(environment.appURL + 'organizer/onlineoffer/save', offerObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Notification By Id Api
  getOnlineOfferById(notificationId: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/getone', {notificationid: notificationId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Photo Upload Api
  uploadBanner(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/banner', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
}
