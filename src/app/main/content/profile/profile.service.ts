import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public isOpenAddEditArrangementDialog$: BehaviorSubject<any>;

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) {
    this.isOpenAddEditArrangementDialog$ = new BehaviorSubject<any>(null);
  }

  updateProfilePic(profilePicObj: any, isBusinessProfile: boolean = false): any {
    return this.http.post(environment.appURL + 'organizer/profile/' + (isBusinessProfile ? 'businessprofilepic' : 'profilepic'), profilePicObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  updateProfile(profileObj: any): any {
    return this.http.post(environment.appURL + 'organizer/profile', profileObj, this._globalFunctions.getAuthorizationHeader());
  }

  updateBusiness(businessProfileObj: any): any {
    return this.http.post(environment.appURL + 'organizer/profile/businessprofile', businessProfileObj, this._globalFunctions.getAuthorizationHeader());
  }

}
