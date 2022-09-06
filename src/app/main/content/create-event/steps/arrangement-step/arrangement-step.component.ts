import { Component, OnInit } from '@angular/core';
import { GlobalFunctions } from 'src/app/main/common/global-functions';

declare var $: any;

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {

  constructor(public _globalFunctions: GlobalFunctions) { }

  ngOnInit(): void {
    this._globalFunctions.loadAccordion();
  }

}
