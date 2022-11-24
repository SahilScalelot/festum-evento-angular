import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from "../../create-event.service";
import { GlobalFunctions } from "../../../../common/global-functions";
import { CONSTANTS } from 'src/app/main/common/constants';

@Component({
  selector: 'app-add-event-step',
  templateUrl: './add-event-step.component.html',
  styleUrls: ['./add-event-step.component.scss']
})
export class AddEventStepComponent implements OnInit {
  isEditEvent: boolean = false;
  isLoading: boolean = false;
  constants: any = CONSTANTS;
  eventId: any;
  addEditEvent: any = {};

  constructor(
    private _globalService: GlobalService,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('eId')) {
      this.eventId = localStorage.getItem('eId');
      this.getEvent(this.eventId);
    } else {
      this._router.navigate(['/events']);
    }
  }

  next(): any {
    this._router.navigate(['/events/create/about-event']);
  }

  deleteEvent(): void {
    // Open delete confirmation popup
    this.isLoading = true;
    this._createEventService.deleteEvent(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
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
      if (result && result.IsSuccess) {
        this.addEditEvent = result.Data;
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
    this.addEditEvent = editedEventObj;
  }

  closePop(flag: boolean): void {
    this.isEditEvent = flag;
  }

}
