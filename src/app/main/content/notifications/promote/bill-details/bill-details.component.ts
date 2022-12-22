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
  couponsList: any = [];
  isCouponLoading: boolean = false;
  isLoading: boolean = false;
  selectedCoupon: any = '';

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
    this._promoteService.getSettings().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.settingObj = this._globalFunctions.copyObject(result.Data[0]);
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
    this.calculateTotalObj.notificationTotal = this.settingObj.notificationcost;
    this.calculateTotalObj.smsTotal = this.settingObj.smscost;
    this.calculateTotalObj.emailTotal = this.settingObj.emailcost;
    this.calculateTotalObj.totalDiscount = this.settingObj.emailcost;
    this.calculateTotalObj.total = _.sum([this.calculateTotalObj.notificationTotal, this.calculateTotalObj.smsTotal, this.calculateTotalObj.emailTotal]);

  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.promoteNotification$.next(result.Data);
        this._prepareBillDetailsForm(result.Data);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onNextClick(): any {
    if (this.isLoading) {
      return false;
    }
    // const preparedDateAndTimeObj: any = this.prepareDateAndTimeObj(this.dateAndTimeForm.value);
    // this.isLoading = true;
    // this._promoteService.saveSchedule(this.billDetailsForm.value).subscribe((result: any) => {
    //   if (result && result.IsSuccess) {
    //     this._sNotify.success('Publish Date and Time Added Successfully.', 'Success');
    //     this._router.navigate(['/notifications/promote/bill-details']);
    //     this.isLoading = false;
    //   } else {
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //     this.isLoading = false;
    //   }
    // }, (error: any) => {
    //   this._globalFunctions.errorHanding(error, this, true);
    //   this.isLoading = false;
    // });
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
