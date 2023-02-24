import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { SnotifyService } from "ng-snotify";
import { PromoteService } from "../promote.service";
import { Router } from "@angular/router";
import { GlobalFunctions } from "../../../../common/global-functions";
import { GlobalService } from "../../../../../services/global.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {
  nId: any;
  billDetailsForm: any;
  notificationObj: any = {};
  settingObj: any = {};
  calculateTotalObj: any = {};
  selectedPlanObj: any = {};
  couponsList: any = [];
  isCouponLoading: boolean = false;
  isLoading: boolean = false;
  selectedCoupon: any = '';
  numberOfUsers: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _promoteService: PromoteService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.nId = localStorage.getItem('nId');
    if (this.nId && this.nId != '') {
      this._prepareBillDetailsForm();
      this.notificationObj = this._globalService.promoteNotification$.getValue();
      if (this.notificationObj && this.notificationObj._id && this.notificationObj._id != '') {
        this._prepareBillDetailsForm(this.notificationObj);
      } else {
        this.getNotificationById();
      }
      this.getCoupons();
      this.getSettings();
    } else {
      this._router.navigate(['notifications']);
    }
  }

  getCoupons(): void {
    this.isCouponLoading = true;
    this._promoteService.getCouponsList().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.couponsList = this._globalFunctions.copyObject(result.Data);
        this.isCouponLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isCouponLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isCouponLoading = false;
    });
  }

  getSettings(): void {
    this.isLoading = true;
    this._promoteService.getSettings(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.settingObj = this._globalFunctions.copyObject(result.Data?.settings[0] || {});
        this.selectedPlanObj = this._globalFunctions.copyObject(result.Data?.planData || {});
        this.numberOfUsers = result.Data.numberofusers;
        this.calculatePrice();
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  calculatePrice(): void {
    const isNotify = (this.notificationObj && this.notificationObj.is_notification);
    const isNotifyBySMS = (this.notificationObj && this.notificationObj.is_sms);
    const isNotifyByEmail = (this.notificationObj && this.notificationObj.is_email);

    this.calculateTotalObj.notificationTotal = (isNotify) ? Number(this.numberOfUsers) * Number(this.settingObj.notificationcost) : 0;
    this.calculateTotalObj.smsTotal = (isNotifyBySMS) ? Number(this.numberOfUsers) * Number(this.settingObj.smscost) : 0;
    this.calculateTotalObj.emailTotal = (isNotifyByEmail) ? Number(this.numberOfUsers) * Number(this.settingObj.emailcost) : 0;
    this.calculateTotalObj.subTotal = _.sum([this.calculateTotalObj.notificationTotal, this.calculateTotalObj.smsTotal, this.calculateTotalObj.emailTotal]);

    if (this.selectedPlanObj && this.selectedPlanObj._id) {
      this.calculateTotalObj.notificationTotal = (isNotify) ? this.selectedPlanObj.notification_amount : 0;
      this.calculateTotalObj.smsTotal = (isNotifyBySMS) ? this.selectedPlanObj.sms_amount : 0;
      this.calculateTotalObj.emailTotal = (isNotifyByEmail) ? this.selectedPlanObj.email_amount : 0;
      this.calculateTotalObj.planDiscount = (isNotify && isNotifyBySMS && isNotifyByEmail);

      this.calculateTotalObj.subTotal = _.sum([this.calculateTotalObj.notificationTotal, this.calculateTotalObj.smsTotal, this.calculateTotalObj.emailTotal]);
      if (this.calculateTotalObj.planDiscount) {
        this.calculateTotalObj.subTotal = this.selectedPlanObj.combo_amount;
      }
    }

    this.calculateTotalObj.totalCouponDiscount = 0;
    if (this.selectedCoupon && this.selectedCoupon._id) {
      if (this.selectedCoupon.amount) {
        this.calculateTotalObj.totalCouponDiscount = (this.selectedCoupon.amount <= this.calculateTotalObj.subTotal) ? this.selectedCoupon.amount : this.calculateTotalObj.subTotal;
      } else if (this.selectedCoupon.percentage) {
        const percentageCount = (this.selectedCoupon.percentage * (this.calculateTotalObj.subTotal / 100));
        this.calculateTotalObj.totalCouponDiscount = (percentageCount <= this.calculateTotalObj.subTotal) ? percentageCount : this.calculateTotalObj.subTotal;
      }
    }
    this.calculateTotalObj.total = this.calculateTotalObj.subTotal - this.calculateTotalObj.totalCouponDiscount;
  }

  onApplyCoupon(coupon: any = {}): void {
    this.selectedCoupon = this._globalFunctions.copyObject(coupon);
    this.calculatePrice();
  }

  onRemoveCoupon(): void {
    this.selectedCoupon = '';
    this.calculatePrice();
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.promoteNotification$.next(result.Data);
        this.notificationObj = result.Data;
        this._prepareBillDetailsForm(result.Data);
        this.calculatePrice();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  prepareCalculatedObj(): any {
    const tmpPrepareCalculatedObj: any = this._globalFunctions.copyObject(this.calculateTotalObj || {});
    const preparedCalculatedObj: any = {};
    preparedCalculatedObj.notificationid = this._globalFunctions.copyObject(this.nId || '');
    preparedCalculatedObj.notification_amt = tmpPrepareCalculatedObj.notificationTotal;
    preparedCalculatedObj.sms_amt = tmpPrepareCalculatedObj.smsTotal;
    preparedCalculatedObj.email_amt = tmpPrepareCalculatedObj.emailTotal;
    preparedCalculatedObj.discount_coupon = this.selectedCoupon?._id || '';
    preparedCalculatedObj.total = tmpPrepareCalculatedObj.total;
    return preparedCalculatedObj;
  }

  payNow(): any {
    if (this.isLoading) {
      return false;
    }
    const preparedCalculatedObj: any = this.prepareCalculatedObj();
    this.isLoading = true;
    this._promoteService.processPayment(preparedCalculatedObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._sNotify.success('Payment Successfully.', 'Success');
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onBackClick(): void {
    this._router.navigate(['/notifications/promote/publish-date-and-time']);
  }

  private _prepareBillDetailsForm(dateAndTimeObj: any = {}): void {
    this.billDetailsForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      notification_time: [dateAndTimeObj?.notification_time || ''],
      is_notification : [dateAndTimeObj?.is_notification  || false],
      is_email: [dateAndTimeObj?.is_email || false],
      is_sms: [dateAndTimeObj?.is_sms || false],
    });
  }

}
