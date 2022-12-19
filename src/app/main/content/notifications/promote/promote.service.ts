import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoteService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Get Notification By Id Api
  getNotificationById(notificationId: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/getone', {notificationid: notificationId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Select Business User Type Api
  saveUserType(userTypeObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/selectusertype', userTypeObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Select Business Users Api
  saveUsers(usersObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/selectusers', usersObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Set Schedule Api
  saveSchedule(scheduleObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/setschedule', scheduleObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Import CSV File Api
  getImportedUsersList(usersObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/userlist', usersObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Import CSV File Api
  importUsersCSV(csvObj: any): any {
    return this.http.post(environment.appURL + 'organizer/notification/import', csvObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Get Promotion Plan List Api
  getPromotionPlans(): any {
    return this.http.get(environment.appURL + 'organizer/promotionplan/list', this._globalFunctions.getAuthorizationHeader());
  }

}
