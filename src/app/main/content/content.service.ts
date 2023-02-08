import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Online Offers List Api
  searchList(search: any): any {
    return this.http.post(environment.appURL + 'organizer/search', {'search': search}, this._globalFunctions.getAuthorizationHeader());
  }

}
