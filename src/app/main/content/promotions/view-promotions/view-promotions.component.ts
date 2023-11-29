import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionsService } from "../promotions.service";
import * as moment from 'moment';
import {GlobalFunctions} from "../../../common/global-functions";
import { SnotifyService } from 'ng-snotify';

import * as _ from 'lodash';

@Component({
  selector: 'app-view-promotions',
  templateUrl: './view-promotions.component.html',
  styleUrls: ['./view-promotions.component.scss']
})
export class ViewPromotionsComponent implements OnInit {
  notificationId: any = '';
  notificationObj: any = {};
  calculateTotalObj: any = {};
  isLoading: boolean = false;
  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _globalFunctions: GlobalFunctions,
              private _promotionsService: PromotionsService,
              private _sNotify: SnotifyService) { }

  ngOnInit(): void {
    this.notificationId = this._activatedRoute.snapshot.paramMap.get('id');
    this.getNotificationById(this.notificationId);
  }

  getNotificationById(notificationId: any): void {
    this.isLoading = true;
    this._promotionsService.getNotificationById(notificationId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.notificationObj = result?.Data || {};
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

    this.calculateTotalObj.notificationTotal = (isNotify) ? Number(this.notificationObj.selectedusers) * Number(this.notificationObj.notification_cost) : 0;
    this.calculateTotalObj.smsTotal = (isNotifyBySMS) ? Number(this.notificationObj.selectedusers) * Number(this.notificationObj.sms_cost) : 0;
    this.calculateTotalObj.emailTotal = (isNotifyByEmail) ? Number(this.notificationObj.selectedusers) * Number(this.notificationObj.email_cost) : 0;
    this.calculateTotalObj.subTotal = _.sum([this.calculateTotalObj.notificationTotal, this.calculateTotalObj.smsTotal, this.calculateTotalObj.emailTotal]);

    this.calculateTotalObj.total = this.calculateTotalObj.subTotal;
  }
}
