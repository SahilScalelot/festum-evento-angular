import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateStreamService {

  constructor(private http: HttpClient, private _globalFunctions: GlobalFunctions) { }

  // Get Live Stream By Id Api
  getLiveStreamById(liveStreamId: any): any {
    return this.http.get(environment.appURL + 'organizer/livestream/getlivestream?livestreamid=' + liveStreamId, this._globalFunctions.getAuthorizationHeader());
  }

  // Create Live Stream Api
  createLiveStream(liveStreamObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/save', liveStreamObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream By Id Api
  getLiveStreamMediaById(liveStreamId: any): any {
    return this.http.get(environment.appURL + 'organizer/livestream/getmedia?livestreamid=' + liveStreamId, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Media Api
  saveLiveStreamMedia(mediaObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/media', mediaObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream Company Details By Id Api
  getCompanyDetailsById(liveStreamId: any): any {
    return this.http.get(environment.appURL + 'organizer/livestream/getcompanydetails?livestreamid=' + liveStreamId, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Company Details Api
  saveCompanyDetails(companyDetailsObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/companydetails', companyDetailsObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream Personal Details By Id Api
  getPersonalDetailsById(liveStreamId: any): any {
    return this.http.get(environment.appURL + 'organizer/livestream/getpersonaldetails?livestreamid=' + liveStreamId, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream Personal Details Api
  savePersonalDetails(personalDetailsObj: any): any {
    return this.http.post(environment.appURL + 'organizer/livestream/personaldetails', personalDetailsObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Get Live Stream T&C By Id Api
  getTAndCById(liveStreamId: any): any {
    return this.http.get(environment.appURL + 'organizer/livestream/gettandc?livestreamid=' + liveStreamId, this._globalFunctions.getAuthorizationHeader());
  }

  // Live Stream T&C Api
  saveLiveStreamTAndC(tAndCObj: any): any {
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
