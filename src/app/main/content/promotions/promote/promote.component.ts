import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { GlobalService } from "../../../../services/global.service";
import { WindowRef } from "../../../../services/windowRef.service";
import { CONSTANTS } from "../../../common/constants";
import { PromoteService } from './promote.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.scss'],
  providers: [WindowRef]
})
export class PromoteComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  accessCode: any;
  encRequestRes : any;
  order_no : any = 'qaz234567';
  testAmount : any = '10';
  selectedAddress : any = {
    name : 'testing',
    address : 'test address',
    city : 'test city',
    pincode : '23456',
    state : 'state test',
    phone : '1234567890'
  };

  nId: any;
  constants: any = CONSTANTS;
  promoteForm: any;
  notificationObj: any = {};
  settingObj: any = {};
  allPromotionPlans: any = [];
  allImportedUsers: any = [];
  isAllUserSelected: boolean = false;
  isExistingUserSelected: boolean = false;
  isUploadCSVLoading: boolean = false;
  tmpSelectedPlan: any = '';
  totalUsers: any = 0;
  totalUsersCount: any = 5000;
  usersSelectionLimit: any = 500;
  calculateTotalObj: any = {};
  selectedPlanObj: any = {};
  couponsList: any = [];
  isCouponLoading: boolean = false;
  selectedCoupon: any = '';
  numberOfUsers: any = 0;
  isLoading: boolean = false;
  pageObj: any = {};

  constructor(private _formBuilder: FormBuilder,
              private _sNotify: SnotifyService,
              private _promoteService: PromoteService,
              private _router: Router,
              private _globalFunctions: GlobalFunctions,
              private _globalService: GlobalService, private winRef: WindowRef) {
  }

  ngOnInit(): void {
    this.accessCode = 'AVIF27KJ05CN98FINC';
    this.nId = localStorage.getItem('nId');
    if (this.nId && this.nId != '') {
      this._preparePromoteForm();
      this.getNotificationById();
      // this.notificationObj = this._globalService.promoteNotification$.getValue();
      // console.log(this.notificationObj);
      // if (this.notificationObj && this.notificationObj._id && this.notificationObj._id != '') {
      //   this._preparePromoteForm(this.notificationObj);
      //   this.promoteForm.get('usertype').updateValueAndValidity();
      // } else {
      //   this.getNotificationById();
      // }
      this.getCoupons();
      //this.getSettings();
      this.getPromotionPlans();
    } else {
      this._router.navigate(['promotions']);
    }
   // if (this.notificationObj !== null ) {
      this.promoteForm.get('usertype').valueChanges.subscribe((change: any) => {
        console.log(change)
      });
   // }
  }
  get totalOptions() {
    return new Array(this.totalUsersCount ? (Math.ceil((this.totalUsersCount + 1) / this.usersSelectionLimit)) : 0);
  }
  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.notificationObj = result.Data;
        if (this.notificationObj.is_email || this.notificationObj.is_sms) {
          this.constants.userTypeArr.splice(5, 1);
        }
        this._globalService.promoteNotification$.next(result.Data);
        this._preparePromoteForm(result.Data);
        if (result.Data?.usertype) {
          this.getTotalUsers(result.Data.usertype);
        }
        if (result.Data.usertype === 'existingusers') {
           this.getImportedUsersList();
        }
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  private _preparePromoteForm(promoteObj: any = {}): void {
    console.log(promoteObj);
    this.promoteForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      payment_id: [promoteObj?.payment_id || ''],
      usertype: [promoteObj?.usertype || '', [Validators.required]],
      selectedusers: [promoteObj?.selectedusers || '', [Validators.required]],
      published_location: [promoteObj?.published_location || ''],
      selected_plan: [promoteObj?.selected_plan || ''],
      is_selected_all: [promoteObj?.is_selected_all || false],
      notification_cost: [promoteObj?.notification_cost || null],
      sms_cost: [promoteObj?.sms_cost || null],
      email_cost: [promoteObj?.email_cost || null],
      total_cost: [promoteObj?.total_cost || null],
      excelusersarray: [null]
    });
  }

  getTotalUsers(userType: any): void {
    const userTypes = {
      notificationid: this.nId,
      usertype: userType
    };
    this._promoteService.saveUserType(userTypes).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.settingObj = this._globalFunctions.copyObject(result.Data?.cost || {});
        if (userType === 'onlineofferusers') {
          this.totalUsers = result.Data.totalonlineofferusers;
        } else if (userType === 'eventusers') {
          this.totalUsers = result.Data.totaleventusers;
        } else if (userType === 'shopusers') {
          this.totalUsers = result.Data.totalshopusers;
        } else if (userType === 'livestreamusers') {
          this.totalUsers = result.Data.totallivestreamusers;
        } else if (userType === 'allusers') {
          this.totalUsers = result.Data.totalusers;
        } else {
          return
        }
        //this.usersSelectionLimit = this.totalUsers;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);

      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);

    });
  }

  getPromotionPlans(): any {
    this.isLoading = true;
    this._promoteService.getPromotionPlans().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.allPromotionPlans = result.Data;
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

  getImportedUsersList(): any {
    this.isLoading = true;
    const filterObj: any = {
        "notificationid" : this.nId,
         page : this.pageObj?.nextPage || 1,
         limit : this.pageObj?.limit || 6,
        "search" : ""
    };
    this._promoteService.getImportedUsersList(filterObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        if (this.allImportedUsers && this.allImportedUsers.length) {
          this.allImportedUsers = _.concat(...this.allImportedUsers, result.Data.docs);
        } else {
          this.allImportedUsers = this._globalFunctions.copyObject(result.Data.docs);
        }
        // if (this.allImportedUsers && this.allImportedUsers.length && !(localStorage.getItem('selectAll'))) {
        //   this.allImportedUsers = _.map(this.allImportedUsers, (importedUser: any) => {
        //     return {...importedUser, selected: false};
        //   });
        // }
        this.pageObj = this._globalFunctions.copyObject(result.Data);
        this.totalUsers = this.pageObj.totalDocs;
        delete this.pageObj.docs;
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

  uploadUserCSV(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.isUploadCSVLoading = true;
      const file = event.target.files[0];
      if (file.type != 'text/csv' && file.type != 'text/xml' && file.type != 'text/xls' && file.type != 'text/xlsx') {
        this._sNotify.error('File type is Invalid.', 'Oops!');
        return false;
      }

      const importCSVObj: any = new FormData();
      importCSVObj.append('file', file);
      importCSVObj.append('notificationid', this.nId);
      this._promoteService.importUsersCSV(importCSVObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          if (result.Data.rejectedCount && result.Data.importCount > 0) {
            this._sNotify.success(result.Data.importCount + ' Number of user records uploaded successfully.', 'Success');
          }
          if (result.Data.rejectedCount && result.Data.rejectedCount > 0) {
            this._sNotify.error(result.Data.rejectedCount + ' Number of user records rejected.', 'Oops');
          }
          this.pageObj = {};
          this.allImportedUsers = [];
          this.getImportedUsersList();
          this.isUploadCSVLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isUploadCSVLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isUploadCSVLoading = false;
      });
    }
  }

  onSelectAllChecked(event: any): void {
    if (this.allImportedUsers && this.allImportedUsers.length) {
      this.isLoading = true;
      const status: boolean = (event && event.target && event.target.checked);
      const prepareCheckAllUserObj: any = {
        notificationid: this.nId,
        is_selected_all: status,
      };
      this._promoteService.checkAllUser(prepareCheckAllUserObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.allImportedUsers = _.map(this.allImportedUsers, (importedUser: any) => {
            return {...importedUser, selected: status};
          });
          if (event && event.target && event.target.checked) {
            localStorage.setItem('selectAll', 'true');
          } else {
            localStorage.removeItem('selectAll');
          }
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
  }

  onCheckboxChange(importedUser: any, index: number): void {
    if (importedUser && importedUser._id) {
      this.isLoading = true;
      const prepareCheckUserObj: any = {
        notificationid: this.nId,
        userid: importedUser._id,
        selected: !(importedUser.selected)
      };
      this._promoteService.checkUser(prepareCheckUserObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const allImportedUsers: any = this._globalFunctions.copyObject(this.allImportedUsers);
          allImportedUsers[index].selected = !(importedUser.selected);
          this.allImportedUsers = this._globalFunctions.copyObject(allImportedUsers);
          if (!prepareCheckUserObj.selected) {
            //this.usersForm.get('is_selected_all').setValue(false);
            localStorage.removeItem('selectAll');
          }
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
  }
  onPromotionPlanClick(): void {
    setTimeout(() => {
      if (this.promoteForm.value.selected_plan && this.promoteForm.value.selected_plan == this.tmpSelectedPlan) {
        this.promoteForm.get('selected_plan').setValue('');
        this.tmpSelectedPlan = '';
      } else {
        this.tmpSelectedPlan = this.promoteForm.value.selected_plan;
        this.promoteForm.get('numberofusers').setValue('');
        this.promoteForm.get('published_location').setValue('');
      }
    }, 0);
  }
  onChangeUserSelection(event: any): void {
    this.promoteForm.get('selectedusers').setValue(Number(event.target.value));
    console.log(this.promoteForm.value);
    this.numberOfUsers = event.target.value;
    this.calculatePrice();
    //this.usersForm.get('selected_plan').setValue('');
    this.tmpSelectedPlan = '';
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
console.log('test here');
console.log(this.calculateTotalObj);
    this.promoteForm.get('notification_cost').setValue(Number(this.calculateTotalObj.notificationTotal.toFixed(2)));
    this.promoteForm.get('sms_cost').setValue(Number(this.calculateTotalObj.smsTotal.toFixed(2)));
    this.promoteForm.get('email_cost').setValue(Number(this.calculateTotalObj.emailTotal.toFixed(2)));
    this.promoteForm.get('total_cost').setValue(Number(this.calculateTotalObj.subTotal.toFixed(2)));
    console.log(this.promoteForm.value);
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

  validateForm(): any {
    if (this.promoteForm.invalid) {
      Object.keys(this.promoteForm.controls).forEach((key) => {
        this.promoteForm.controls[key].touched = true;
        this.promoteForm.controls[key].markAsDirty();
      });
      return false;
    }
    return true;
  }

  payNow(): any {
    if (!this.validateForm()) {
      return false;
    }

    if (this.isLoading) {
      return false;
    }

    this.isLoading = true;
    let options:any = {
      key: "rzp_test_TYPb3cPjWHwjBY",
      amount: this.promoteForm.value.total_cost * 100,
      currency: 'INR',
      name: "Festum Evento Pvt Ltd.",
      description: "dummy data",
      image: "./assets/images/logo.png",
      modal: {
        "escape": false
      },
      theme: {
        "color": "#6fbc29"
      }
    };
    options.handler = ((response: any) => {
      console.log(response);
      options['payment_response_id'] = response.razorpay_payment_id;
      this.promoteForm.get('payment_id').setValue(response.razorpay_payment_id);
      this._promoteService.processPayment(this.promoteForm.value).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          console.log(result);
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
    });
    options.modal.ondismiss = ((response: any) => {
      console.log(response);
      this.isLoading = false;
    });
    let rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
