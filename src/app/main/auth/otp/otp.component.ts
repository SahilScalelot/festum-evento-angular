import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFunctions } from '../../common/global-functions';
import { GlobalService } from '../../../services/global.service';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  otp1: any;
  otp: FormControl | any;
  isForgotPwdFlow: boolean = false;
  phone: any = '';

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _sNotify: SnotifyService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('reMob')) {
      this.phone = localStorage.getItem('reMob');
    } else if (localStorage.getItem('fPMob')) {
      this.isForgotPwdFlow = true;
      this.phone = localStorage.getItem('fPMob');
    } else if (localStorage.getItem('register')) {
      localStorage.removeItem('fPMob');
      var p = JSON.parse(localStorage.getItem('register')!);
      this.phone = p.mobile;
    } else {
      this._router.navigate(['/login']);
    }

    this.otp = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]);
  }

  resendOtp(): any {
    var mobile = localStorage.getItem('fPMob');
    console.log(mobile);
    this._authService.forgotPassword(mobile).subscribe((res: any) => {
      console.log(res);
    });
  }

  onChangeNumberClick(): void {
    this._router.navigate([
      this.isForgotPwdFlow ? '/forgot-password' : '/register',
    ]);
  }

  onOtpChange(event: any): void {
    this.otp1 = event;
    if (event.length == 6) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
    }
  }

  verifyOtp(): void {
    if (localStorage.getItem('forgot')) {
      var pwd = JSON.parse(localStorage.getItem('forgot')!);
      var mobile = JSON.parse(localStorage.getItem('register')!);
      // console.log(mobile.mobile, this.otp1, pw.smsKey);
      var verifyOTP = {
        mobile: mobile.mobile,
        otp: this.otp1,
        key: pwd.smsKey
      }

      this._authService.verifyCode(verifyOTP).subscribe((res: any) => {
        console.log(res);
        if (res) {
          console.log(146, 'matched');
          localStorage.removeItem('reMob');
          localStorage.removeItem('fPMob');
          if (localStorage.getItem('register')) {
            var data = JSON.parse(localStorage.getItem('register')!);
            this._authService.register(data).subscribe((result: any) => {
              if (result.status) {
                this._sNotify.success(result.message, 'Success');
                this._router.navigate(['login']);
              } else {
                this._sNotify.success(result.message, 'error');
                this._globalFunctions.successErrorHandling(
                  result,
                  this,
                  true
                );
              }
            },
              (error: any) => {
                this._globalFunctions.errorHanding(error, this, true);
              }
            );
          }
        }
      });
    }

    if (localStorage.getItem('forgot1')) {
      var pwd = JSON.parse(localStorage.getItem('forgot1')!);
      var mobile = JSON.parse(localStorage.getItem('fPMob')!);
      console.log(mobile, this.otp1, pwd.smsKey);
      var verifyOTP = {
        mobile: mobile,
        otp: this.otp1,
        key: pwd.smsKey
      }
      this._authService.verifyCode(verifyOTP).subscribe((res: any) => {
        console.log(res);
        if (res) {
          console.log(146, 'matched');
          localStorage.removeItem('reMob');
          // localStorage.removeItem('fPMob');
          this._router.navigate(['/set-new-password']);
        }
      });
    }
    
    // else {
    //   console.log('otp not matched');
    //   }
    // },
    // (error: any) => {
    //   console.log('not matched');
    // }

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
}
