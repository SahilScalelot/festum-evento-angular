import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { GlobalFunctions } from '../../common/global-functions';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('logInNgForm') logInNgForm: any;
  logInForm: any;

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
    localStorage.clear();
    this.logInForm = this._formBuilder.group({
      mobile: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  validate(): boolean {
    let flag: boolean = true;
    const errorFields: any = [];
    if (!this.logInForm.value.mobile || this.logInForm.value.mobile === "") {
      // this._sNotify.error('Email or mobile is required!', 'Oops!');

      errorFields.push('Email or Mobile');
      flag = false;
      // return false;
    }
    if (!this.logInForm.value.password || this.logInForm.value.password === "") {
      // this._sNotify.error('Password is required!', 'Oops!');
      errorFields.push('Password');
      flag = false;
      // return false;
    }
    if (!flag) {
      let errorString: string = '';
      errorString = errorFields.join(' & ');
      this._sNotify.error(errorString + ' must be filled!', 'Oops!');
    }
    return flag;
    // return true;
  }

  logIn(): void {
    // if (this.logInForm.invalid) {
    //   return;
    // }
    if (!this.validate()) {
      return;
    }
    this.logInForm.disable();
    this._authService.logIn(this.logInForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        localStorage.setItem('accessToken', result.Data.token);
        this._sNotify.success('Logged in Successfully!', 'Success');
        this._router.navigate(['events']);
      } else {
        this.logInForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.logInForm.enable();
      this.logInNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

}
