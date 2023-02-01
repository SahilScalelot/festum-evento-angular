import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Injectable({
  providedIn: 'root'
})
export class RedeemCoinService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }
  
  getRedeemHistory(): any {
    return this.http.get(environment.appURL + 'organizer/redeem/history', this._globalFunctions.getAuthorizationHeader());
  }

}
