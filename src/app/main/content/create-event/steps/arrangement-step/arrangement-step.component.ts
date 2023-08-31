import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CONSTANTS} from 'src/app/main/common/constants';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {CreateEventService} from "../../create-event.service";
import * as _ from 'lodash';
import { ModalService } from 'src/app/main/_modal';

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
  tmpSeatingObj: any = '';
  eventId: any = '';
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  arrangementsArr: any = [];
  event_typ: any;
  arrangementsArr1:any;
  isOpenPopup: boolean = false;
  isImage: boolean = false;
  companyIAndV: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  attendees: Array<any> = [];
  cancelEventPop: boolean = false;
  isSingleVideo: boolean = false;
  @Input() arrangementObj: any = {};

  constructor(
    public _globalFunctions: GlobalFunctions,
    public _router: Router,
    private _modalService: ModalService,
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
        this.arrangementsArr = result.Data.seating_arrangements || []; 
        this.event_typ = result.Data;
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

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean, isSingleVideo: boolean = false): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isSingleVideo = isSingleVideo;
    this.isOpenPopup = true;
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

  
  deletePop(seatingId: any = ''): void {
    this.tmpSeatingObj = seatingId;
    this._modalService.open("delete-event-pop");
  }
  close(): void {
    this.tmpSeatingObj = '';
    this._modalService.close("delete-event-pop");
  }
  
  openArrangementPopup(arrangementObj: any = {}): void {
    this.editArrangementObj = arrangementObj;
    this.isArrangement = true;
  }
  
  deleteArrangement(seatingId: any = ''): void {
    this.arrangementsArr = _.remove(this.arrangementsArr, (arrangement: any) => {
      return arrangement.seating_item != seatingId;
    });
    this.tmpSeatingObj = '';
    this._modalService.close("delete-event-pop");
  }

  closePop(flag: boolean): void {
    this.isOpenPopup = flag;
    this.cancelEventPop = false;
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
    this.isLoading = true;
    const preparedObj: any = this.prepareObj(this.arrangementsArr);
    this._createEventService.arrangements(preparedObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isLoading = false;
        this._router.navigate(['/events/create/location']);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }
  
  prepareObj(arrangementsArr: any = []): any {
    const tmpArrangementsArr = this._globalFunctions.copyObject(arrangementsArr);
    const preparedObj: any = {};
    preparedObj.eventid = this.eventId;
    preparedObj.seating_arrangements = [];
    tmpArrangementsArr.forEach((arrangement: any) => {
      arrangement.seating_item = arrangement.seating_item._id;
      _.each(arrangement.arrangements, (arrangementSeating: any) => {
        arrangementSeating.per_person_price = Number(arrangementSeating.per_person_price).toFixed(2);
        arrangementSeating.per_seating_price = Number(arrangementSeating.per_seating_price).toFixed(2);
        arrangementSeating.total_amount = Number(arrangementSeating.total_amount).toFixed(2);
        if (arrangementSeating && arrangementSeating.vertical_location && arrangementSeating.vertical_location != '' && arrangementSeating.horizontal_location && arrangementSeating.horizontal_location != '') {
          arrangementSeating.icon = 'global/icons/' + (arrangementSeating.vertical_location.toLowerCase()) + '_' + (arrangementSeating.horizontal_location.toLowerCase()) + '.svg';
        }
      });
      preparedObj.seating_arrangements.push(arrangement);
    });
    return preparedObj;
  }
}
