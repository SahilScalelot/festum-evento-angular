import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {GlobalFunctions} from "../../common/global-functions";
import {GlobalService} from "../../../services/global.service";
import {SnotifyService} from "ng-snotify";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent implements OnInit {
  otp: FormControl | any;
  isForgotPwdFlow: boolean = false;
  phone: any = '';

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('reMob')) {
      this.phone = localStorage.getItem('reMob');
    } else if (localStorage.getItem('fPMob')) {
      this.isForgotPwdFlow = true;
      this.phone = localStorage.getItem('fPMob');
    } else {
      this._router.navigate(['/login']);
    }

    this.otp = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  onChangeNumberClick(): void {
    this._router.navigate([this.isForgotPwdFlow ? '/forgot-password' : '/register']);
  }

  verifyOtp(): void {
    localStorage.removeItem('reMob');
    localStorage.removeItem('fPMob');
    this._router.navigate(['/set-new-password']);

    // if (!this.otp.invalid) {
    //   const otpObj: any = {
    //     mobile: this.phone,
    //     otp: this.otp.value
    //   };
    //   this._authService.verifyOtp(otpObj).subscribe((result: any) => {
    //     if (result.flag) {
    //       this._sNotify.success(result.message, 'Success');
    //
    //       localStorage.removeItem('reMob');
    //       localStorage.removeItem('fPMob');
    //
    //       this._router.navigate(['/set-new-password']);
    //     } else {
    //       this._sNotify.success(result.message, 'error');
    //       this._globalFunctions.successErrorHandling(result, this, true);
    //     }
    //   }, (error: any) => {
    //     // this.registerNgForm.resetForm();
    //     this._globalFunctions.errorHanding(error, this, true);
    //     // this._sNotify.success(result.message, 'error');
    //   });
    // }
  }

  onOtpChange(event: any): void {
    if (event.length == 6) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
    }
  }

}
