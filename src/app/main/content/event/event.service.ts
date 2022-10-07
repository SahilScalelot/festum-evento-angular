import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }

  retrieveEvents(): any {
    return this.http.get(environment.appURL + 'events/', this._globalFunctions.getAuthorizationHeader());
  }
  
  retrieveEventsId(id: any): any {
    return this.http.get(environment.appURL + 'events/'+id, this._globalFunctions.getAuthorizationHeader());
  }

  // retrieveUser(): any {
  //   return this.http.get(environment.appURL + 'events/', this._globalFunctions.getAuthorizationHeader());
  // }
}
