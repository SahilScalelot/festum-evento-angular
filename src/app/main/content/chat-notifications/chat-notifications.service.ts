import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
    providedIn: 'root'
})
export class ChatNotificationsService {

    constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }

    // Chat Notification List
    getChatNotificationList(data: any = {}): any {
        return this.http.post(environment.appURL + 'organizer/chatnotification', data, this._globalFunctions.getAuthorizationHeader());
    }

}
