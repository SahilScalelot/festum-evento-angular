import {Component, OnInit} from '@angular/core';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss']
})
export class AddEventsComponent implements OnInit {
  events: any = [];
  selectedEventIndex: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.events = [
      {id: 1, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].label},
      {id: 2, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].label},
      {id: 3, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.PUBLIC].label},
      {id: 4, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].label},
      {id: 5, title: 'Cooking Together', description: 'Conference', eventType: CONSTANTS.unitTypeArr[CONSTANTS.eventType.PUBLIC].label},
    ]
  }

  selectEvent(index: number): void {
    // console.log(index);
    this.selectedEventIndex = index;
  }

}
