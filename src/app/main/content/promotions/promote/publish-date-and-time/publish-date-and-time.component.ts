import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalFunctions } from "../../../../common/global-functions";
import { GlobalService } from "../../../../../services/global.service";
import { PromoteService } from "../promote.service";
import { SnotifyService } from "ng-snotify";
import { Router } from "@angular/router";
import * as moment from "moment";

@Component({
  selector: 'app-publish-date-and-time',
  templateUrl: './publish-date-and-time.component.html',
  styleUrls: ['./publish-date-and-time.component.scss']
})
export class PublishDateAndTimeComponent implements OnInit {
  nId: any;
  dateAndTimeForm: any;
  notificationObj: any = {};
  isLoading: boolean = false;
  minDateValue: any = new Date();

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
      this._prepareDateAndTimeForm();
      this.notificationObj = this._globalService.promoteNotification$.getValue();
      if (this.notificationObj && this.notificationObj._id && this.notificationObj._id != '') {
        this._prepareDateAndTimeForm(this.notificationObj);
      } else {
        this.getNotificationById();
      }
    } else {
      this._router.navigate(['promotions']);
    }
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.promoteNotification$.next(result.Data);
        this._prepareDateAndTimeForm(result.Data);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  validateDateAndTimeObj(): boolean {
    if (!this.dateAndTimeForm.value.notification_date || this.dateAndTimeForm.value.notification_date == "") {
      this._sNotify.error('Notification Date is required!', 'Oops!');
      return false;
    }
    if (!this.dateAndTimeForm.value.notification_time || this.dateAndTimeForm.value.notification_time == "") {
      this._sNotify.error('Notification Time is required!', 'Oops!');
      return false;
    }
    if (!this.dateAndTimeForm.value.is_notification && !this.dateAndTimeForm.value.is_email && !this.dateAndTimeForm.value.is_sms) {
      this._sNotify.error('Please select at least one category!', 'Oops!');
      return false;
    }
    return true;
  }

  onNextClick(): any {
    if (this.isLoading || !this.validateDateAndTimeObj()) {
      return false;
    }
    const preparedDateAndTimeObj: any = this.prepareDateAndTimeObj(this.dateAndTimeForm.value);
    this.isLoading = true;
    this._promoteService.saveSchedule(preparedDateAndTimeObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.promoteNotification$.next(result.Data);
        this._sNotify.success('Publish Date and Time Added Successfully.', 'Success');
        this._router.navigate(['/promotions/promote/bill-details']);
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

  prepareDateAndTimeObj(dateAndTimeObj: any = {}): any {
    const preparedDateAndTimeObj: any = this._globalFunctions.copyObject(dateAndTimeObj);
    preparedDateAndTimeObj.notification_date = moment(dateAndTimeObj.notification_date).format('YYYY-MM-DD');
    preparedDateAndTimeObj.notification_time = this.prepareTime(dateAndTimeObj.notification_time);
    return preparedDateAndTimeObj;
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return dateWithTime.getHours() + ':' + dateWithTime.getMinutes();
    }
    return dateWithTime;
  }

  onBackClick(): void {
    this._router.navigate(['/promotions/promote/users']);
  }

  private _prepareDateAndTimeForm(dateAndTimeObj: any = {}): void {
    this.dateAndTimeForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      notification_date: [dateAndTimeObj && dateAndTimeObj.notification_date ? new Date(dateAndTimeObj?.notification_date) : ''],
      notification_time: [dateAndTimeObj?.notification_time || ''],
      is_notification : [dateAndTimeObj?.is_notification  || false],
      is_email: [dateAndTimeObj?.is_email || false],
      is_sms: [dateAndTimeObj?.is_sms || false],
    });
  }

}
