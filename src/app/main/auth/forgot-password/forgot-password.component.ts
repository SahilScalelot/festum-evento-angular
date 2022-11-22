import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service"
import { GlobalFunctions } from '../../common/global-functions';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPwdObj: any = {};
  isLoading: boolean = false;
  phone: FormControl | any;

  constructor(
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _authService: AuthService,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('forgot-password')) {
      this.forgotPwdObj = JSON.parse(localStorage.getItem('forgot-password')!);
    }
    this.phone = new FormControl(this.forgotPwdObj?.mobile || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
  }

  sendVerificationCode(): any {
    if (!this.phone.invalid) {
      this.isLoading = true;
      this._authService.sendOTP({ mobile: this.phone.value }, true).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const preparedForgotPwdObj: any = {};
          preparedForgotPwdObj.smsKey = result.Data.key;
          preparedForgotPwdObj.mobile = this.phone.value;
          localStorage.setItem('forgot-password', JSON.stringify(preparedForgotPwdObj));
          this.isLoading = false;
          this._router.navigate(['/otp']);
        } else {
          this._sNotify.error(result.Message, 'error');
          // this._globalFunctions.successErrorHandling(result, this, true);
          this.isLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }
}
