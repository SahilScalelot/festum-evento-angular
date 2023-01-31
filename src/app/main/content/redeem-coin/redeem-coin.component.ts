import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { GlobalFunctions } from '../../common/global-functions';

@Component({
  selector: 'app-redeem-coin',
  templateUrl: './redeem-coin.component.html',
  styleUrls: ['./redeem-coin.component.scss']
})
export class RedeemCoinComponent implements OnInit {
  isLoading: boolean = false;
  userObj: any = {};

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.userObj = this._globalFunctions.copyObject(user);
        this.isLoading = false;
      }
    });
  }

}
