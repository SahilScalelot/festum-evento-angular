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

  eventRegister(eventObj: any): any {
    return this.http.post(environment.appURL + 'event/register/', eventObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Add Event First Step
  addEvent(eventObj: any): any {
    return this.http.post(environment.appURL + 'org/event/add', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  editEvent(eventId: any, eventObj: any): any {
    return this.http.put(environment.appURL + 'org/event/' + eventId, eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  deleteEvent(eventId: any): any {
    return this.http.delete(environment.appURL + 'org/event/delete/' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Images And Video Api
  uploadImages(): any {
    return this.http.post(environment.appURL + 'event/image/', this._globalFunctions.getFileAuthorizationHeader());
  }

  uploadVideos(): any {
    return this.http.post(environment.appURL + 'event/video/', this._globalFunctions.getFileAuthorizationHeader());
  }

  // Company Detail Api
  addCompanyDetail(CompanyDetailObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail', CompanyDetailObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  addCompanyDetailImages(CompanyImageObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail/image', CompanyImageObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  addCompanyDetailVideos(CompanyVideoObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail/video', CompanyVideoObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Personal Detail Api
  addPersonalDetail(): any {
    return this.http.post(environment.appURL + 'event/personaldetail/', this._globalFunctions.getAuthorizationHeader());
  }

  // seats Api
  getSeatingItems(): any {
    return this.http.get(environment.appURL + 'seats', this._globalFunctions.getAuthorizationHeader());
  }

  // Discounts Apis
  getAllDiscounts(eventId: any): any {
    return this.http.get(environment.appURL + 'org/discount?event_id=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  updateDiscount(eventId: any, discountId: any, discountObj: any): any {
    return this.http.put(environment.appURL + 'org/discount/' + discountId + '?event_id=' + eventId, discountObj, this._globalFunctions.getAuthorizationHeader());
  }
}
