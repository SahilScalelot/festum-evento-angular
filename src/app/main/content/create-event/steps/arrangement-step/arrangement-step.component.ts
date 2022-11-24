import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CONSTANTS} from 'src/app/main/common/constants';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {CreateEventService} from "../../create-event.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-arrangement-step',
  templateUrl: './arrangement-step.component.html',
  styleUrls: ['./arrangement-step.component.scss']
})
export class ArrangementStepComponent implements OnInit {
  seatingItems: any = [];
  tmpSeatingItems: any = [];
  isArrangement: boolean = false;
  constants: any = CONSTANTS;
  editArrangementObj: any = {};
  eventId: any = '';
  isLoading: boolean = false;
  arrangementsArr: any = [];

  @Input() arrangementObj: any = {};

  constructor(
    public _globalFunctions: GlobalFunctions,
    public _router: Router,
    private _createEventService: CreateEventService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this.editArrangementObj = {};
    this.getArrangements();
    this.getSeatingItems();

    this._createEventService.isOpenAddEditArrangementDialog$.subscribe((isOpenAddEditArrangementDialog: boolean) => {
      this.isArrangement = isOpenAddEditArrangementDialog;
    });
    this.isArrangement = false;
  }

  getArrangements(): void {
    this.isLoading = true;
    this._createEventService.getArrangements(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.arrangementsArr = result.Data.arrangements || [];
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  getSeatingItems(): void {
    this.isLoading = true;
    this._createEventService.getSeatingItems().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.seatingItems = result.Data || [];
        this.tmpSeatingItems = this._globalFunctions.copyObject(this.seatingItems);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  toggleAccordion(event: any, index: any): void {
    const element: any = event.target;
    const panel: any = element.nextElementSibling;

    if (panel && panel.style) {
      element.classList.toggle("active");
      this.arrangementsArr[index].isActive = !this.arrangementsArr[index].isActive;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  openArrangementPopup(arrangementObj: any = {}): void {
    this.editArrangementObj = arrangementObj;
    this.isArrangement = true;
  }

  deleteArrangement(seatingId: any = ''): void {
    this.arrangementsArr = _.remove(this.arrangementsArr, (arrangement: any) => {
      return arrangement.seating_item != seatingId;
    });
  }

  closePop(flag: boolean): void {
    this.seatingItems = this._globalFunctions.copyObject(this.tmpSeatingItems);
    this.editArrangementObj = {};
    this.isArrangement = flag;
  }

  addEditArrangement(arrangementsArr: any = []): void {
    if (arrangementsArr && arrangementsArr.length) {
      this.arrangementsArr = arrangementsArr;
    }
  }

  onNextStep(): void {
    // this.newEventObj.emit(this.eventObj);
  }

}
