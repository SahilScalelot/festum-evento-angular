import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { RedeemCoinService } from './redeem-coin.service';

@Component({
  selector: 'app-redeem-coin',
  templateUrl: './redeem-coin.component.html',
  styleUrls: ['./redeem-coin.component.scss']
})
export class RedeemCoinComponent implements OnInit {
  isLoading: boolean = false;
  paging: any;
  redeemCoinHistory: any = [];
  userObj: any = {};
  constants: any = CONSTANTS;

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _redeemCoinService: RedeemCoinService
  ) { }

  ngOnInit(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.userObj = user;
        this.isLoading = false;
      }
    });
    this.getLoginUser();
    this.getRedeemHistory();
  }

  getLoginUser(): void {
    this.isLoading = true;
    this._redeemCoinService.getLoginUser().subscribe((result: any) => {
      if (result) {
        this.userObj = this._globalFunctions.copyObject(result.Data);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getRedeemHistory(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
         page : page || '1',
         limit : event?.rows || '10'
    };
    this._redeemCoinService.getRedeemHistory(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.redeemCoinHistory = this._globalFunctions.copyObject(result.Data.docs);
        this.paging = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

}
