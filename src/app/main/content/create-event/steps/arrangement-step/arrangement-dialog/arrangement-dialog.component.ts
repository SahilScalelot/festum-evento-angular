import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';

@Component({
  selector: 'app-arrangement-dialog',
  templateUrl: './arrangement-dialog.component.html',
  styleUrls: ['./arrangement-dialog.component.scss']
})
export class ArrangementDialogComponent implements OnInit {
  @Input() popClass: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  constants: any = CONSTANTS;
  preparedSeatingItems: any = [];
  isArrangement: boolean = false;

  selectedTab = 0;

  constructor() { }

  ngOnInit(): void {
    this.preparedSeatingItems = CONSTANTS.seatingItems;
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

}
