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

  // Add Event First Step
  getEventCategories(eventTypeObj: any = {}): any {
    return this.http.post(environment.appURL + 'organizer/categories/list', eventTypeObj, this._globalFunctions.getAuthorizationHeader());
  }
  addEvent(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/save', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getEvent(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events?eventid='+eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // About Event Step
  about(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/about', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getAbout(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/about?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Arrangement Event Step
  arrangements(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/arrangement', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getArrangements(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/arrangement?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Location Event Step
  location(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/location', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getLocation(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/location?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Media Event Step
  photosAndVideo(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/media', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getPhotosAndVideos(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/media?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Permission Event Step
  permission(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/permission', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  // Company Detail Event Step
  companyDetail(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/companydetail', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getCompanyDetail(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/companydetail?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Personal Detail Event Step
  personalDetail(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/personaldetail', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getPersonalDetail(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/personaldetail?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Terms And Conditions Event Step
  tAndC(eventObj: any): any {
    return this.http.post(environment.appURL + 'organizer/events/tandc', eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  getTAndC(eventId: any): any {
    return this.http.get(environment.appURL + 'organizer/events/tandc?eventid=' + eventId, this._globalFunctions.getAuthorizationHeader());
  }

  // Banner Api
  uploadBanner(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/events/banner', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }

  // Images Api
  uploadImages(photoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/events/image', photoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
  
  // Video Api
  uploadVideos(videoFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/events/video', videoFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
  
  // PDF Api
  documentUpload(pdfFormData: any): any {
    return this.http.post(environment.appURL + 'organizer/events/document', pdfFormData, this._globalFunctions.getFileAuthorizationHeader());
  }
















  eventRegister(eventObj: any): any {
    return this.http.post(environment.appURL + 'event/register/', eventObj, this._globalFunctions.getFileAuthorizationHeader());
  }
  editEvent(eventId: any, eventObj: any): any {
    return this.http.put(environment.appURL + 'org/event/' + eventId, eventObj, this._globalFunctions.getAuthorizationHeader());
  }
  
  deleteEvent(eventId: any): any {
    return this.http.post(environment.appURL + 'organizer/events/remove', {eventid: eventId}, this._globalFunctions.getAuthorizationHeader());
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
    return this.http.get(environment.appURL + 'organizer/item/list', this._globalFunctions.getAuthorizationHeader());
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

}
