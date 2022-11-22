import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../common/constants';
import { GlobalFunctions } from '../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _httpClient: HttpClient, 
    private _globalFunctions: GlobalFunctions
  ) { }

  getLoginUser(): Observable<any> {
    return this._httpClient.get(CONSTANTS.appUrl + 'organizer/profile', this._globalFunctions.getAuthorizationHeader());
  }

  logIn(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'organizer/login', credentials, this._globalFunctions.getHeader());
  }

  register(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'organizer/register', credentials, this._globalFunctions.getHeader());
  }

  sendOTP(mobileObj: any, isForgotPwd: boolean = false): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'organizer/register' + (isForgotPwd ? '/forgotpassword' : ''), mobileObj, this._globalFunctions.getHeader());
  }

  verifyCode(verifyOTP: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'organizer/register/verifyotp', verifyOTP, this._globalFunctions.getHeader());
  }

  changePassword(newPassword: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'organizer/register/changepassword', newPassword, this._globalFunctions.getHeader());
  }
}
