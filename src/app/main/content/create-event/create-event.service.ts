import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreateEventService {
  public isOpenAddEditArrangementDialog$: BehaviorSubject<any>;

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) {
    this.isOpenAddEditArrangementDialog$ = new BehaviorSubject<any>(null);
  }

  eventRegister(): any {
    return this.http.post(environment.appURL + 'event/register/', this._globalFunctions.getAuthorizationHeader());
  }

  // Add Event First Step
  eventAdd(): any {
    return this.http.post(environment.appURL + 'org/event/add', this._globalFunctions.getAuthorizationHeader());
  }

  // Images And Video Api
  uploadImages(): any {
    return this.http.post(environment.appURL + 'event/image/', this._globalFunctions.getFileAuthorizationHeader());
  }

  uploadVideos(): any {
    return this.http.post(environment.appURL + 'event/video/', this._globalFunctions.getFileAuthorizationHeader());
  }

  // Company Detail Api
  AddCompanyDetail(): any {
    return this.http.post(environment.appURL + 'event/companydetail/', this._globalFunctions.getFileAuthorizationHeader());
  }

  AddCompanyDetailImages(): any {
    return this.http.post(environment.appURL + 'event/companydetail/image/', this._globalFunctions.getFileAuthorizationHeader());
  }

  AddCompanyDetailVideos(): any {
    return this.http.post(environment.appURL + 'event/companydetail/video/', this._globalFunctions.getFileAuthorizationHeader());
  }

  // Personal Detail Api
  AddPersonalDetail(): any {
    return this.http.post(environment.appURL + 'event/personaldetail/', this._globalFunctions.getAuthorizationHeader());
  }
}
