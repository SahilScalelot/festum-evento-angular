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
  // PDF Api
  documentUpload(pdfFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/profile/gst', pdfFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Video Api
  uploadVideos(videoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/profile/video', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Images Api
  uploadImages(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/profile/image', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

    // Kyc Api
    kycDetail(photoFormData: any): any {
      return this.http.post(environment.appURL + 'organizer/profile/kyc', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
    }
  

}
