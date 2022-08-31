import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @Input() popClass: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  eventType: any;
  constants: any = CONSTANTS;

  constructor() { }

  ngOnInit(): void {
    this.eventType = CONSTANTS.unitTypeArr[CONSTANTS.eventType.B2B].options;
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

}
