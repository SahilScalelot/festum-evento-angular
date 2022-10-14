import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from 'src/app/main/_modal';
import { CreateEventService } from '../../create-event.service';
import {GlobalFunctions} from "../../../../common/global-functions";
import * as _ from 'lodash';

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

  constructor(
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService, 
  ) {
  }

  ngOnInit(): void {
    this.getAllDiscounts();
    this.getSeatingItems();

    this.discountForm = this._formBuilder.group({
      discount_type: [null, [Validators.required]],
      seating_type: [null],
      discount: [null, [Validators.required]],
    });
  }

  getAllDiscounts(): void {
    this.isLoading = true;
    this._createEventService.getAllDiscounts().subscribe((result: any) => {
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
        console.log(this.seatingItems);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  popupOpen(popId: string, discountObj: any = {}): void {
    this.discountForm.patchValue({
      discount_type: discountObj.discount_type,
      seating_type: discountObj.seating_type,
      discount: (discountObj.discount.includes('%')) ? discountObj.discount.replace('%', '') : discountObj.discount,
    });
    console.log(this.discountForm.value);
    this._modalService.open(popId);
  }
  
  multipleLiveEvent(event: any): void {
    event.stopPropagation();
  }

  submitDiscount(): any {
    const discountObj: any = this.discountForm.value;
    discountObj.discount = discountObj.discount.toString() + '%';
    console.log(discountObj);
    // this._modalService.close("discountDialog");
  }
  
  closePop(): any {
    this.discountForm.reset();
    this._modalService.close('discountDialog');
  }
}
