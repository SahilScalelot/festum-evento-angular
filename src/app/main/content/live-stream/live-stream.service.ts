import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Live Streams List Api
  liveStreamsList(pageLimit: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream', pageLimit, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream By Id Api
  getLiveStreamById(liveStreamId: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/getone', {livestreamid: liveStreamId}, this._globalFunctions.getAuthorizationHeader());
  }
  
  // Get Live Stream By Id Api
  removeLiveStreamById(liveStreamId: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/remove', {livestreamid: liveStreamId}, this._globalFunctions.getAuthorizationHeader());
  }

  // Export Attendees
  exportAttendees(liveStreamIdObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/livestreamattendees/export', liveStreamIdObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream Status & Viewer Count
  getLiveStreamStatus(liveStreamId: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/viewercount', {livestreamid: liveStreamId}, this._globalFunctions.getAuthorizationHeader());
  }
}
