import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class GlobalService {
  public loginUser$: BehaviorSubject<any>;

  constructor() {
    this.loginUser$ = new BehaviorSubject<any>(null);
  }
}
