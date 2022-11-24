import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import {CreateEventService} from "../../create-event.service";
import {GlobalFunctions} from "../../../../common/global-functions";

@Component({
  selector: 'app-add-event-step',
  templateUrl: './add-event-step.component.html',
  styleUrls: ['./add-event-step.component.scss']
})
export class AddEventStepComponent implements OnInit {
  isEditEvent: boolean = false;
  isLoading: boolean = false;

  eventId: any;
  add_event: any = {};

  constructor(
    private _globalService: GlobalService,
    private _sNotifyService: SnotifyService,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getEventId();
    this.getEvent(this.eventId);    
  }

  next(): any {
    this._router.navigate(['/events/create/about-event']);
  }

  getEventId(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventId = JSON.parse(eventString);
    } else {
      this._router.navigate(['/events']);
    }
  }

  deleteEvent(eventId: any): void {
    // Open delete confirmation popup
    this.isLoading = true;
    this._createEventService.deleteEvent(eventId).subscribe((result: any) => {
      if (result && result.delete) {
        this._globalService.addEditEvent$.next(null);
        this._router.navigate(['/events']);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getEvent(eventId: any): any {
    this.isLoading = true;
    this._createEventService.getEvent(eventId).subscribe((result: any) => {
      if (result && result.Data) {
        this.add_event = result.Data;
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  editEvent(editedEventObj: boolean): void {
    this.add_event = editedEventObj;
  }

  closePop(flag: boolean): void {
    // this.prepareEventObj();
    this.isEditEvent = flag;
  }

}
