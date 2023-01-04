import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from "../../create-event.service";
import { GlobalFunctions } from "../../../../common/global-functions";
import { CONSTANTS } from 'src/app/main/common/constants';
import { ModalService } from 'src/app/main/_modal';

@Component({
  selector: 'app-add-event-step',
  templateUrl: './add-event-step.component.html',
  styleUrls: ['./add-event-step.component.scss']
})

export class AddEventStepComponent implements OnInit {
  isEditEvent: boolean = false;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  constants: any = CONSTANTS;
  eventId: any;
  addEditEvent: any = {};

  constructor(
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _modalService: ModalService,
    private _router: Router,
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
  deletePop(): void {
    this._modalService.open("delete-event-pop");
  }
  close(): void {
    this._modalService.close("delete-event-pop");
  }
  deleteEvent(): void {
    // Open delete confirmation popup
    this.isDeleteLoading = true;
    this._createEventService.deleteEvent(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.addEditEvent$.next(null);
        this._router.navigate(['/events']);
        this.isDeleteLoading = false;
        this._modalService.close("delete-event-pop");
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isDeleteLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isDeleteLoading = false;
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
