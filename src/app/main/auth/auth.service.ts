import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../common/constants';
import { GlobalFunctions } from '../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpClient: HttpClient, private _globalFunctions: GlobalFunctions) { }

  logIn(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/login/', credentials, this._globalFunctions.getHeader());
  }

  register(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/register/', credentials, this._globalFunctions.getHeader());
  }

}
