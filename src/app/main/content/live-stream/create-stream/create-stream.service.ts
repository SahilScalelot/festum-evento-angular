import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateStreamService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Create Live Stream Api
  createLiveStream(liveStreamObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/save', liveStreamObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Media Api
  liveStreamMedia(mediaObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/media', mediaObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Company Details Api
  liveStreamCompanyDetails(companyDetailsObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/companydetails', companyDetailsObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Company Details Api
  liveStreamPersonalDetails(personalDetailsObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/personaldetails', personalDetailsObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Company Details Api
  liveStreamTAndC(tAndCObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/tandc', tAndCObj, this._globalFunctions.getAuthorizationHeader());
  }

 

  // Document Upload Api
  uploadDocument(documentFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/document', documentFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Banner Upload Api
  uploadBanner(bannerFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/banner', bannerFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Image Upload Api
  uploadImages(imageFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/image', imageFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Video Upload Api
  uploadVideos(videoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/video', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

}
