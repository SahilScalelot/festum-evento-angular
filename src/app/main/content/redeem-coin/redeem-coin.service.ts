import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class RedeemCoinService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }
  
  getRedeemHistory(data: any): any {
    return this.http.post(environment.appURL + 'organizer/redeem/history', data, this._globalFunctions.getAuthorizationHeader());
  }

  getLoginUser(): any {
    return this.http.get(environment.appURL + 'organizer/profile', this._globalFunctions.getAuthorizationHeader());
  }

  redeemrequest(data: any): any {
    return this.http.post(environment.appURL + 'organizer/redeem/request',data , this._globalFunctions.getAuthorizationHeader());
  }

  getScannedUser(data: any): any {
    return this.http.post(environment.appURL + 'organizer/redeem/scanneduser',data , this._globalFunctions.getAuthorizationHeader());
  }

  getExportScannedUser(): any {
    return this.http.post(environment.appURL + 'organizer/redeem/exportscanneduser',null, this._globalFunctions.getFileAuthorizationHeader());
  }

  getListRedeemRequest(data: any): any {
    return this.http.post(environment.appURL + 'organizer/redeem/listrequest',data , this._globalFunctions.getAuthorizationHeader());
  }



}
