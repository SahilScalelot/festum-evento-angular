import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
import {GlobalFunctions} from '../../common/global-functions';
import {AuthService} from '../auth.service';
import {FuseValidators} from '../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerNgForm') registerNgForm: any;
  registerForm: any;

  pwd: boolean = false;
  confirmPwd: boolean = false;

  get confirmPassword(): any {
    return this.registerForm.get('confirm_password');
  }

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _sNotify: SnotifyService
  ) {

  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]],
      refer_code: [''],
      country_code: ['+91'],
      role: [4],
    }, {
      validators: FuseValidators.mustMatch('password', 'confirm_password')
    });    
  }  

  // verifyOtp(): void {
  //   var pw = JSON.parse(localStorage.getItem('forgot')!);
  //   var mnum = JSON.parse(localStorage.getItem('fPMob')!);

  //   this._authService.verifyCode(mnum, this.otp1, pw.smsKey).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       if (res) {
  //         console.log(146, 'matched');
  //         localStorage.removeItem('reMob');
  //         localStorage.removeItem('fPMob');
  //         this._router.navigate(['/set-new-password']);
  //       } else {
  //         console.log('otp not matched');
  //       }
  //     },
  //     (error: any) => {
  //       console.log('not matched');
  //     }
  //   );
  // }

  register(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.controls[key].touched = true;
        this.registerForm.controls[key].markAsDirty();
      });
      return;
    }

    localStorage.setItem("register",JSON.stringify(this.registerForm.value))
    this.registerForm.disable();
    this._authService.sendOTP(this.registerForm.value.mobile).subscribe((result: any) => {
      if (result && result.status) {
        localStorage.setItem('register_sms_key', result.smsKey);  
        this._router.navigate(['/otp']);
      } else {
        this._sNotify.success(result.message, 'error');
        this.registerForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.registerForm.enable();
      // this.registerNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      this._sNotify.success(error.message, 'error');
    });
  //   this._authService.register(this.registerForm.value).subscribe((result: any) => {
  //     if (result.flag) {
  //       this._sNotify.success(result.message, 'Success');
  //       this._router.navigate(['login']);
  //     } else {
  //       this._sNotify.success(result.message, 'error');
  //       this.registerForm.enable();
  //       this._globalFunctions.successErrorHandling(result, this, true);
  //     }
  //   }, (error: any) => {
  //     this.registerForm.enable();
  //     // this.registerNgForm.resetForm();
  //     this._globalFunctions.errorHanding(error, this, true);
  //     // this._sNotify.success(result.message, 'error');
  //   });
  // }
  }
}
