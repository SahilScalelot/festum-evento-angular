import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctions } from 'src/app/main/common/global-functions';

declare var $: any;

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {
  isArrangement: boolean = false;

  constructor(public _globalFunctions: GlobalFunctions,public _router: Router) { }

  ngOnInit(): void {
    this._globalFunctions.loadAccordion();
  }

  openAddEventDialog(): void {
    this.isArrangement = true;
  }

  closePop(flag: boolean): void {
    this.isArrangement = flag;
  }

}
