import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }

    // Notification List
    getNotificationList(data: any = {}): any {
        return this.http.post(environment.appURL + 'organizer/alertnotification', data, this._globalFunctions.getAuthorizationHeader());
    }

}
