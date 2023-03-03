import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
import {GlobalFunctions} from '../../common/global-functions';
import { ModalService } from '../../_modal';
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

  eventObj: any = {};

  get confirmPassword(): any {
    return this.registerForm.get('confirm_password');
  }

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _sNotify: SnotifyService,
    private _modalService: ModalService,
  ) {

  }

  ngOnInit(): void {
    localStorage.clear();
    this.registerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      country_code: ['+91'],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      refer_code: [''],
      fcm_token: [''],
      tandc: [false, [Validators.requiredTrue]],
    }, {
      validators: FuseValidators.mustMatch('password', 'confirm_password')
    });
  }
  // confirm_password: ['', [Validators.required]],
  // role: [4],

  register(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.controls[key].touched = true;
        this.registerForm.controls[key].markAsDirty();
      });
      return;
    }
    this.registerForm.disable();
    this._authService.register(this.registerForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const preparedForgotPwdObj: any = this.registerForm.value;
        preparedForgotPwdObj.smsKey = result.Data.key;
        localStorage.setItem("register", JSON.stringify(preparedForgotPwdObj));
        this._router.navigate(['/otp']);
      } else {
        this._sNotify.error(result.Message, 'error');
        this.registerForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.registerForm.enable();
      // this.registerNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      // this._sNotify.error(error.Message, 'error');
    });
  }

  tAndCPop(): void {
    if (this.registerForm.value && this.registerForm.value.tandc == false) {
      this.registerForm.get('tandc').setValue(false);
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.registerForm.get('tandc').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.registerForm.get('tandc').setValue(true);
    this._modalService.close("tandc");
  }
}
