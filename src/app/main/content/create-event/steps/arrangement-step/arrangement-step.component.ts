import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {CreateEventService} from "../../create-event.service";

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {
  isArrangement: boolean = false;

  constructor(
    public _globalFunctions: GlobalFunctions, 
    public _router: Router, 
    private _createEventService: CreateEventService) {
  }

  ngOnInit(): void {
    this._globalFunctions.loadAccordion();
    this._createEventService.isOpenAddEditArrangementDialog$.subscribe((isOpenAddEditArrangementDialog: boolean) => {
      this.isArrangement = isOpenAddEditArrangementDialog;
    });
  }

  openAddEventDialog(): void {
    this.isArrangement = true;
  }

  closePop(flag: boolean): void {
    this.isArrangement = flag;
  }
}
