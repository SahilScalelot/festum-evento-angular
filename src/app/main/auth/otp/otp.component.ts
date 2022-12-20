import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFunctions } from '../../common/global-functions';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  otp: FormControl | any;
  forgotPwdObj: any = {};
  registerObj: any = {};
  isForgotPwdFlow: boolean = false;
  isLoading: boolean = false;
  phone: any = '';
  smsKey: any = '';

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('forgot-password')) {
      this.isForgotPwdFlow = true;
      localStorage.removeItem('register');
      this.forgotPwdObj = JSON.parse(localStorage.getItem('forgot-password')!);
      this.phone = this.forgotPwdObj.mobile;
      this.smsKey = this.forgotPwdObj.smsKey;
    } else if (localStorage.getItem('register')) {
      localStorage.removeItem('forgot-password');
      this.registerObj = JSON.parse(localStorage.getItem('register')!);
      this.phone = this.registerObj.mobile;
      this.smsKey = this.registerObj.smsKey;
    } else {
      this._router.navigate(['/login']);
    }

    this.otp = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  resendOtp(): any {
    this.isLoading = true;
    this._authService.sendOTP({ mobile: this.phone }, this.isForgotPwdFlow).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.smsKey = result.smsKey;        
        if (this.isForgotPwdFlow) {
          this.forgotPwdObj.smsKey = result.smsKey;
          localStorage.setItem('forgot-password', JSON.stringify(this.forgotPwdObj));
        } else {
          this.registerObj.smsKey = result.smsKey;
          localStorage.setItem("register", JSON.stringify(this.registerObj));
        }
        this.isLoading = false;
      } else {
        this._sNotify.success(result.Message, 'error');
        // this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  onChangeNumberClick(): void {
    this._router.navigate([this.isForgotPwdFlow ? '/forgot-password' : '/register']);
  }

  onOtpChange(event: any): void {
    if (event.length == 6) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
    }
  }

  verifyOtp(): void {
    this.isLoading = true;
    const verifyOTP: any = {
      mobile: this.phone,
      otp: this.otp.value,
      key: this.smsKey
    };

    this._authService.verifyCode(verifyOTP).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        if (this.isForgotPwdFlow) {
          localStorage.removeItem('forgot-password');
          localStorage.setItem('phone', JSON.stringify(verifyOTP.mobile));
          this._router.navigate(['/set-new-password']);
        } else {
          localStorage.removeItem('forgot-password');
          this.registerUser(verifyOTP);
        }
        this.isLoading = false;
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

  registerUser(verifyOTP: any): any {
    this.isLoading = true;    
    this._authService.verifyCode(verifyOTP).subscribe((result: any) => {
      if (result.IsSuccess) {
        localStorage.removeItem('register');
        this._sNotify.success('Organizer registered successfully', 'Success');
        this._router.navigate(['login']);
        this.isLoading = false;
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
