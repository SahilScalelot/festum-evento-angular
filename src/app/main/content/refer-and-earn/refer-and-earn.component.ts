import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { GlobalFunctions } from '../../common/global-functions';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss']
})
export class ReferAndEarnComponent implements OnInit {
  isLoading: boolean = false;
  userObj: any = {};

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _clipboard: Clipboard,
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

  copyLink(copyText: any) {
    this._clipboard.copy(copyText);
    this._sNotify.success('Code Copied.');
  }

}
