import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from 'src/app/main/_modal';
import { CreateEventService } from '../../create-event.service';
import { GlobalFunctions } from "../../../../common/global-functions";
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-discount-step',
  templateUrl: './discount-step.component.html',
  styleUrls: ['./discount-step.component.scss']
})
export class DiscountStepComponent implements OnInit {
  isLoading: boolean = false;
  seatingItems: any = [];
  discounts: any = [];
  discountForm: any;
  tmpDiscountObj: any = {};
  selectedDiscountIds: any = [];

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
  ) {
  }

  ngOnInit(): void {
    this.tmpDiscountObj = {};
    this.getAllDiscounts();
    this.getSeatingItems();
    if (!localStorage.getItem('newEventObj')) {
      this._router.navigate(['/events']);
    }

    const newEventObj: any = localStorage.getItem('newEventObj');
    const eventId = JSON.parse(newEventObj).add_event.id;
    this.discountForm = this._formBuilder.group({
      discount_type: [null, [Validators.required]],
      equipment_id: [null],
      discount: [null, [Validators.required]],
      event_id: [eventId || '', [Validators.required]],
    });
  }

  getAllDiscounts(): void {
    this.isLoading = true;
    const newEventObj: any = localStorage.getItem('newEventObj');
    const eventId = JSON.parse(newEventObj).add_event.id;
    this._createEventService.getAllDiscounts(eventId).subscribe((result: any) => {
      if (result && result.isSuccess) {
        this.discounts = result.data || [];
        _.each(this.discounts, (discount: any) => {
          discount.name = discount.discount_type.replace(/_/g, ' ');
        });
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  getSeatingItems(): void {
    this.isLoading = true;
    this._createEventService.getSeatingItems().subscribe((result: any) => {
      if (result && result.status) {
        this.seatingItems = result.data || [];
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  popupOpen(popId: string, discountObj: any = {}, index: number): void {
    const newEventObj: any = localStorage.getItem('newEventObj');
    const eventId = JSON.parse(newEventObj).add_event.id;
    this.tmpDiscountObj = this._globalFunctions.copyObject(discountObj);
    this.tmpDiscountObj.discountIndex = index;

    this.discountForm.patchValue({
      discount_type: discountObj.discount_type,
      equipment_id: discountObj.equipment_id,
      discount: (discountObj.discount.includes('%')) ? discountObj.discount.replace('%', '') : discountObj.discount,
      event_id: eventId
    });
    this._modalService.open(popId);
  }

  updateDiscount(): any {
    this.isLoading = true;
    const discountObj: any = this.discountForm.value;
    discountObj.discount = discountObj.discount.toString() + '%';

    this._createEventService.updateDiscount(discountObj.event_id, this.tmpDiscountObj.id, discountObj).subscribe((result: any) => {
      if (result && result.isSuccess) {
        const discounts = this._globalFunctions.copyObject(this.discounts);
        discounts[this.tmpDiscountObj.discountIndex] = result.data;
        discounts[this.tmpDiscountObj.discountIndex].name = discounts[this.tmpDiscountObj.discountIndex].discount_type.replace(/_/g, ' ');
        this.discounts = this._globalFunctions.copyObject(discounts);

        this._sNotify.success(result.message, 'Success');
        this._modalService.close("discountDialog");
        this.tmpDiscountObj = {};
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  closePop(): any {
    this.discountForm.reset();
    this._modalService.close('discountDialog');
  }

  next(): any {
    this.eventObj = this.selectedDiscountIds
    this.newEventObj.emit(this.eventObj);
    // this._globalService.addEditEvent$.next(this.selectedDiscountIds);
    this._router.navigate(['/create-event/company-details']);
  }
}
