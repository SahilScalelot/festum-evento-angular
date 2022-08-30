import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { GlobalFunctions } from '../../common/global-functions';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerNgForm') registerNgForm: any;
  registerForm: any;

  pwd : boolean = false;
  confirmPwd : boolean = false;

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
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      refer_code: ['', Validators.required],
      country_code: ['+91'],
      role: ['Organiser'],
    });
  }

  
  validate(): boolean {
    if (!this.registerForm.value.name || this.registerForm.value.name === "") {
      this._sNotify.error('Name is required!', 'Oops!');
      return false;
    }
    if (!this.registerForm.value.email || this.registerForm.value.email === "") {
      this._sNotify.error('Email is required!', 'Oops!');
      return false;
    }
    if (!this.registerForm.value.mobile || this.registerForm.value.mobile === "") {
      this._sNotify.error('Mobile is required!', 'Oops!');
      return false;
    }
    if (!this.registerForm.value.password || this.registerForm.value.password === "") {
      this._sNotify.error('Password is required!', 'Oops!');
      return false;
    }
    if (!this.registerForm.value.confirm_password || this.registerForm.value.confirm_password === "") {
      this._sNotify.error('Confirm Password is required!', 'Oops!');
      return false;
    }
    return true;
  }

  register(): void {
    // console.log(this.registerForm.value);
    // if (this.registerForm.invalid) {
    //   return;
    // }
    if (!this.validate()) {
      return;
    }
    
    this.registerForm.disable();
    this._authService.register(this.registerForm.value).subscribe((result: any) => {
      if (result.flag) {
        this._sNotify.success(result.message, 'Success');
        this._router.navigate(['login']);
      } else {
        this._sNotify.success(result.message, 'error');
        this.registerForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.registerForm.enable();
      // this.registerNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      // this._sNotify.success(result.message, 'error');
    });
  }

}
