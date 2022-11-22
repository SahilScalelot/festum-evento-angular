import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';
import { BehaviorSubject, forkJoin, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreateEventService {
  public isOpenAddEditArrangementDialog$: BehaviorSubject<any>;

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) {
    this.isOpenAddEditArrangementDialog$ = new BehaviorSubject<any>(null);
  }

  eventRegister(eventObj: any): any {
    return this.http.post(environment.appURL + 'event/register/', eventObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Add Event First Step
  addEvent(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/create', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  editEvent(eventId: any, eventObj: any): any {
    return this.http.put(environment.appURL + 'org/event/' + eventId, eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  deleteEvent(eventId: any): any {
    return this.http.delete(environment.appURL + 'org/event/delete/' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // About Event Step
  aboutEvent(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/about', eventObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Arrangement Event Step
  arrangementEvent(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/arrangement', eventObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Images And Video Api
  uploadImages(photoFormData: any): any {
    return this.http.post(environment.appURL + 'event/image/', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  uploadVideos(videoFormData: any): any {
    return this.http.post(environment.appURL + 'event/video/', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Company Detail Api
  addCompanyDetail(companyDetailObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail', companyDetailObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  addCompanyImages(companyImageObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail/image', companyImageObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  addCompanyVideos(companyVideoObj: any): any {
    return this.http.post(environment.appURL + 'event/companydetail/video', companyVideoObj, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Personal Detail Api
  addPersonalDetail(personalDetail: any): any {
    return this.http.post(environment.appURL + 'event/personaldetail', personalDetail, this._globalFunctions.getAuthorizationHeader());
  }

  // seats Api
  getSeatingItems(): any {
    return this.http.get(environment.appURL + 'seats', this._globalFunctions.getAuthorizationHeader());
  }

  bookOccasionSeat(bookOccasionSeatObj: any): any {
    return this.http.post(environment.appURL + 'seat/booking', bookOccasionSeatObj, this._globalFunctions.getAuthorizationHeader());
  }

  // Discounts Apis
  getAllDiscounts(eventId: any): any {
    return this.http.get(environment.appURL + 'org/discount?event_id=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  updateDiscount(eventId: any, discountId: any, discountObj: any): any {
    return this.http.put(environment.appURL + 'org/discount/' + discountId + '?event_id=' + eventId, discountObj, this._globalFunctions.getAuthorizationHeader());
  }


  // requestDataFromMultipleSources(
  //   addEventId: any, 
  //   companyDetailObj: any, 
  //   companyImageObj: any, 
  //   companyVideoObj: any,
  //   eventId: any, 
  //   discountId: any, 
  //   discountObj: any
  // ): Observable<any[]> {
  //   let uploadImages = this.uploadImages(addEventId);
  //   let uploadVideos = this.uploadVideos(addEventId);
  //   let addCompanyDetail = this.addCompanyDetail(addEventId, CompanyDetailObj);
  //   let addCompanyDetailImages = this.addCompanyDetailImages(addEventId, CompanyImageObj);
  //   let addCompanyDetailVideos = this.addCompanyDetailVideos(addEventId, CompanyVideoObj);
  //   let addPersonalDetail = this.addPersonalDetail(addEventId);
  //   let updateDiscount = this.updateDiscount(addEventId, eventId, discountId, discountObj);
  //   // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  //   return forkJoin([
  //     addEventId,
  //     companyDetailObj,
  //     companyImageObj,
  //     companyVideoObj,
  //     eventId,
  //     discountId,
  //     discountObj 
  //   ]);
  // }

}
