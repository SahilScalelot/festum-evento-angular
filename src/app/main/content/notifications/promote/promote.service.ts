import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoteService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Select Business User Type Api
  saveUserType(userObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/selectusertype', userObj, this._globalFunctions.getAuthorizationHeader());
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
