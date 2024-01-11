import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { RedeemCoinService } from './redeem-coin.service';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from '../../_modal';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-redeem-coin',
  templateUrl: './redeem-coin.component.html',
  styleUrls: ['./redeem-coin.component.scss']
})
export class RedeemCoinComponent implements OnInit {
  
  @ViewChild('redeemNgForm') redeemNgForm: any;
  isLoading: boolean = false;
  paging: any;
  redeemCoinHistory: any = [];
  userObj: any = {};
  constants: any = CONSTANTS;
  redeemForm: any;
  calculatesum: any = 0;

  Transaction: boolean = true;
  freezed_coin_transaction: boolean = false;
  Scaned_user: boolean = false;
  deposit: boolean = false;
  showMore: boolean = false;
  aboutevent: boolean = false;
  tandcShow: boolean = false;
  scannedCoinHistory: any;
  scannedPaging: any;
  requestCoinHistory: any;
  requestPaging: any;
  exportData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _globalService: GlobalService,
    private _modalService: ModalService,
    private _sNotify: SnotifyService,
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
    this.redeemForm = this._formBuilder.group({
      fcoin: ['', Validators.required]
    });
    this.getLoginUser();
    this.getRedeemHistory();
    this.getScannedUser();
    this.getListRedeemRequest();
    this.getExportScannedUser();
  }

  onTabChange(tabVarName: any): void {
    this.Transaction = this.freezed_coin_transaction = this.Scaned_user = this.deposit = false;
    if (tabVarName == 'Transaction') {
      this.Transaction = true;
    } else if (tabVarName == 'freezed_coin_transaction') {
      this.freezed_coin_transaction = true;
    } else if (tabVarName == 'Scaned_user') {
      this.Scaned_user = true;
    } else if (tabVarName == 'deposit') {
      this.deposit = true;
    }
  }

  redeemCoin(){
    if (this.userObj?.kyc_details?.status == 'pending' ) {
      this._sNotify.error('Wait for KYC Approve.', 'Oops');
    } else if (this.userObj?.kyc_details?.status == 'rejected') {
      this._sNotify.error('Please Complate Your KYC.', 'Oops');
    } else {
      this._modalService.open("delete-event-pop");
    }

  }

  getListRedeemRequest(event: any = {}) {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
         page : page || '1',
         limit : event?.rows || '10'
    };
    this._redeemCoinService.getListRedeemRequest(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        
        this.requestCoinHistory = this._globalFunctions.copyObject(result.Data.docs);
        this.requestPaging = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getScannedUser(event: any = {}){
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
         page : page || '1',
         limit : event?.rows || '10'
    };
    this._redeemCoinService.getScannedUser(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        
        this.scannedCoinHistory = this._globalFunctions.copyObject(result.Data.docs);
        this.scannedPaging = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getExportScannedUser(){
    this._redeemCoinService.getExportScannedUser().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.exportData = this._globalFunctions.copyObject(result.Data);
        console.log("Export Xl File Url",this.exportData);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  calculate(event : any) {
    this.calculatesum = event.target.value / this.userObj.ONE_RUPEE_FCOIN;
  }

  redeem(){
    if (this.redeemForm.invalid) {
      Object.keys(this.redeemForm.controls).forEach((key) => {
        this.redeemForm.controls[key].touched = true;
        this.redeemForm.controls[key].markAsDirty();
      });
      return;
    }
  
    if (this.userObj.f_coins < parseInt(this.redeemForm.value.fcoin)) {
      this._sNotify.error('Enough Coin', 'Oops');
      return;
    }
    const preparedEventObj: any = this.redeemForm.value;
    this.isLoading = true;
    this.redeemForm.disable();
    this._redeemCoinService.redeemrequest(preparedEventObj).subscribe((result: any) => {
    
      if (result && result.IsSuccess) {
        this._sNotify.success('Redeem Coin Succes', 'Succes');
        this.isLoading = false;
        this.redeemForm.enable();
        this.close();
        this.getLoginUser();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
        this.redeemForm.enable();
        this.close();
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
      this.redeemForm.enable();
      this.close();
    });
    
    
  }

  close(): void {
    this._modalService.close("delete-event-pop");
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
