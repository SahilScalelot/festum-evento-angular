import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss']
})
export class AddEventsComponent implements OnInit {
  events: any = [];
  selectedEventIndex: number = 0;

  constructor(private _sNotifyService: SnotifyService, private _rovter: Router) {
  }

  ngOnInit(): void {
    this.events = [
      {id: 1, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].label},
      {id: 2, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].label},
    ]
  }

  selectEvent(index: number): void {
    // console.log(index);
    this.selectedEventIndex = index;
  }

  next(): any {
    
    if (!this.selectedEventIndex) {
      this._sNotifyService.error('Please Select Event', 'Oops!');
    } else {
      this._rovter.navigate(['/create-event/about-event']);
    }    
    // [routerLink]="'/create-event/about-event'"
  }

}
