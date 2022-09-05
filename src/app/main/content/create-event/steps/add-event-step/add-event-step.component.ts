import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-event-step',
  templateUrl: './add-event-step.component.html',
  styleUrls: ['./add-event-step.component.scss']
})
export class AddEventStepComponent implements OnInit {
  isEditEvent: boolean = false;
  selectedEventIndex: number = 0;
  eventObj: any = {};

  constructor(private _globalService: GlobalService, private _sNotifyService: SnotifyService, private _router: Router) {
  }

  ngOnInit(): void {
    this.prepareEvent();
    // this._globalService.addEditEvent$.subscribe((eventObj: any) => {
    //   if (eventObj) {
    //     this.eventObj = eventObj.;
    //   }
    // });
  }

  next(): any {
    this._router.navigate(['/create-event/about-event']);
  }

  prepareEvent(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.eventObj = JSON.parse(eventString);
    } else {
      this._router.navigate(['/event']);
    }
  }

  deleteEvent(): void {
    // Open delete confirmation popup
    localStorage.removeItem('newEventObj');
    this._router.navigate(['/event']);
  }

  closePop(flag: boolean): void {
    this.prepareEvent();
    this.isEditEvent = flag;
  }

}
