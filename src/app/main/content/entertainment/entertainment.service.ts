import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class EntertainmentService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Get Live Stream By Id Api
  getEntertainmentApi(): any {
    return this.http.get(environment.appURL + 'organizer/entertainment', this._globalFunctions.getAuthorizationHeader());
  }
  getMyPostsApi(): any {
    return this.http.get(environment.appURL + 'organizer/entertainment/myposts', this._globalFunctions.getAuthorizationHeader());
  }

}
