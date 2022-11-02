import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Subject} from "rxjs";

@Injectable()
export class GlobalService {
  public loginUser$: BehaviorSubject<any>;
  public addEditEvent$: BehaviorSubject<any>;

  ticketInformation = {
    personalInformation: {
      firstname: '',
      lastname: '',
      age: null
    },
    seatInformation: {
      class: null,
      wagon: null,
      seat: null
    },
    paymentInformation: {
      cardholderName:'',
      cardholderNumber:'',
      date:'',
      cvv:'',
      remember:false
    }
  };

  private paymentComplete = new Subject<any>();

  paymentComplete$ = this.paymentComplete.asObservable();

  getTicketInformation() {
    return this.ticketInformation;
  }

  setTicketInformation(ticketInformation: any) {
    this.ticketInformation = ticketInformation;
  }

  complete() {
    this.paymentComplete.next(this.ticketInformation.personalInformation);
  }
  constructor() {
    this.loginUser$ = new BehaviorSubject<any>(null);
    this.addEditEvent$ = new BehaviorSubject<any>(null);
  }
}
