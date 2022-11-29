import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/main/_modal';
import { CreateEventService } from '../../create-event.service';
import { GlobalFunctions } from "../../../../common/global-functions";
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-discount-step',
  templateUrl: './discount-step.component.html',
  styleUrls: ['./discount-step.component.scss']
})
export class DiscountStepComponent implements OnInit {
  isLoading: boolean = false;
  seatingItems: any = [];
  allDiscounts: any = [];
  discountList: any = [];
  discountForm: any;
  tmpDiscountObj: any = {};
  selectedDiscountTypes: any = [];
  eventId: any = '';

  constructor(
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _createEventService: CreateEventService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.eventId = localStorage.getItem('eId');
    this.tmpDiscountObj = {};
    this.getAllDiscounts();
    this.getSeatingItems();
    this._prepareDiscountForm();
  }

  getAllDiscounts(): void {
    this.isLoading = true;
    this._createEventService.getDiscounts().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.allDiscounts = result.Data || [];
        this.getDiscountByEventId();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  getDiscountByEventId(): void {
    this.isLoading = true;
    this._createEventService.getDiscountByEventId(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const selectedDiscounts: any = result.Data.discounts || [];
        this.selectedDiscountTypes = _.map(selectedDiscounts, 'discounttype');
        this.discountList = _.values(_.merge(_.keyBy(this.allDiscounts, 'discounttype'), _.keyBy(selectedDiscounts, 'discounttype')));
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
      if (result && result.IsSuccess) {
        this.seatingItems = result.Data || [];
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
    this.tmpDiscountObj = this._globalFunctions.copyObject(discountObj);
    this.tmpDiscountObj.discountIndex = index;
    this._prepareDiscountForm(this.tmpDiscountObj);
    this._modalService.open(popId);
  }

  closePop(): any {
    this.discountForm.reset();
    this._modalService.close('discountDialog');
  }

  updateDiscount(): any {
    const discountObj: any = this.discountForm.value;
    discountObj.discount = discountObj.discount.toString() + '%';

    const discountList = this._globalFunctions.copyObject(this.discountList);
    discountList[this.tmpDiscountObj.discountIndex].discount = discountObj.discount || this.tmpDiscountObj.discount;
    discountList[this.tmpDiscountObj.discountIndex].items = discountObj?.items || [];
    discountList[this.tmpDiscountObj.discountIndex].isUpdated = true;
    this.discountList = this._globalFunctions.copyObject(discountList);
    this._modalService.close('discountDialog');
    this.tmpDiscountObj = {};
  }

  next(): any {
    if (this.selectedDiscountTypes && this.selectedDiscountTypes.length) {
      this.isLoading = true;
      const preparedDiscountObj: any = this.prepareDiscountObj(this.selectedDiscountTypes);
      this._createEventService.createDiscount(preparedDiscountObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._router.navigate(['/events/create/company-details']);
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
        this.isLoading = false;
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    } else {
      this._router.navigate(['/events/create/company-details']);
    }
  }

  prepareDiscountObj(selectedDiscountTypes: any = []): void {
    const preapredDiscountObj: any = {};
    preapredDiscountObj.eventid = this.eventId;
    preapredDiscountObj.discounts = _.map(selectedDiscountTypes, (selectedDiscountType: any) => {
      const selectedDiscountObj: any = _.find(this.discountList, ['discounttype', selectedDiscountType]);
      return {
        discountname: selectedDiscountObj.discountname,
        discounttype: selectedDiscountObj.discounttype,
        description: selectedDiscountObj.description,
        discount: selectedDiscountObj.discount,
        tandc: selectedDiscountObj.tandc,
        items: (selectedDiscountObj.isUpdated) ? (selectedDiscountObj?.items || []) : (_.map(selectedDiscountObj?.items || [], '_id') || [])
      };
    });
    return preapredDiscountObj;
  }

  private _prepareDiscountForm(discountObj: any = {}) {
    this.discountForm = this._formBuilder.group({
      discount: [(discountObj.discount && discountObj.discount.includes('%')) ? discountObj.discount.replace('%', '') : discountObj.discount || '', [Validators.required]],
      items: [(discountObj.isUpdated) ? (discountObj?.items || []) : _.map(discountObj?.items || [], '_id') || []],
    });
  }
}
