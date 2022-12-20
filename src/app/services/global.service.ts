import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class GlobalService {
  public loginUser$: BehaviorSubject<any>;
  public addEditEvent$: BehaviorSubject<any>;
  public promoteNotification$: BehaviorSubject<any>;

  constructor() {
    this.loginUser$ = new BehaviorSubject<any>(null);
    this.addEditEvent$ = new BehaviorSubject<any>(null);
    this.promoteNotification$ = new BehaviorSubject<any>(null);
  }
}
