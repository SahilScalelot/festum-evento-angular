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

  // retrieveCreatedEvents(): any {
  //   return this.http.get(environment.appURL + 'event/new/', this._globalFunctions.getAuthorizationHeader());
  // }
}
