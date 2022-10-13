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

  getLoginUser(): Observable<any> {
    return this._httpClient.get(CONSTANTS.appUrl + 'authentication/user/', this._globalFunctions.getAuthorizationHeader());
  }

  logIn(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/login/', credentials, this._globalFunctions.getHeader());
  }

  register(credentials: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/register/', credentials, this._globalFunctions.getHeader());
  }

  forgotPassword(mobileObj: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/sendOtp/?forgot_password=true',mobileObj,this._globalFunctions.getHeader());
  }

  sendOTP(mobileObj: any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/sendOtp/', mobileObj,this._globalFunctions.getHeader());
  }
  
  verifyCode(verifyOTP:any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/verifyOtp/',verifyOTP, this._globalFunctions.getHeader());
  }
  
  changePassword(newPassword:any): Observable<any> {
    return this._httpClient.post(CONSTANTS.appUrl + 'authentication/verifyOtpChangePassword/',newPassword,this._globalFunctions.getHeader());
  }
}
