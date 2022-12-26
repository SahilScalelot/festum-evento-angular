import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }

  // retrieveEvents(limit:any, page: any): any {
  //   return this.http.get(environment.appURL + 'events/' + '?limit='+ limit +'&page=' + page, this._globalFunctions.getAuthorizationHeader());
  // }
  
  eventsList(filter: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/events/list', filter, this._globalFunctions.getFileAuthorizationHeader());
  }
  
  getSingleEvents(eventId: any = ''): any {
    return this.http.get(environment.appURL + 'organizer/events/getone?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  liveEventById(eventId: any = ''): any {
    return this.http.post(environment.appURL + 'organizer/events/liveone', {eventid: eventId}, this._globalFunctions.getAuthorizationHeader());
  }

  liveMultipleEvents(eventIds: any = []): any {
    return this.http.post(environment.appURL + 'organizer/events/livemulti', {eventids: eventIds}, this._globalFunctions.getAuthorizationHeader());
  }

  // retrieveUser(): any {
  //   return this.http.get(environment.appURL + 'events/', this._globalFunctions.getAuthorizationHeader());
  // }
}
