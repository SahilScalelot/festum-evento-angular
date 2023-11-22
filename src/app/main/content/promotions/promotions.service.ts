import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalFunctions} from "../../common/global-functions";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Notification List Api
  getNotificationList(filter: any): any {
    return this.http.post(environment.appURL + 'organizer/notification', filter, this._globalFunctions.getAuthorizationHeader());
  }

  getNotificationEmailTemplate(data: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/template', data, this._globalFunctions.getAuthorizationHeader());
  }
  // Create Notification Api
  createNotification(notificationObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/save', notificationObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Notification By Id Api
  getNotificationById(notificationId: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/getone', {notificationid: notificationId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Photo Upload Api
  uploadBanner(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/banner', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
}
