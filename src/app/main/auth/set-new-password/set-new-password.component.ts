import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FuseValidators} from "../validators";
import {AuthService} from "../../auth/auth.service"
import { GlobalFunctions } from '../../common/global-functions';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {
  setNewPasswordForm: FormGroup | any;
  pwd: boolean = false;
  confirmPwd: boolean = false;
  
  isLoading: boolean = false;

  get password(): any {
    return this.setNewPasswordForm.get('password');
  }

  get confirmPassword(): any {
    return this.setNewPasswordForm.get('confirm_password');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth:AuthService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('phone')) {
      this._router.navigate(['/login']);
    }
    this.setNewPasswordForm = this._formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validators: FuseValidators.mustMatch('password', 'confirm_password')
    });
  }

  setNewPassword(): void {
    if (!this.setNewPasswordForm.invalid) {
      var mobile = JSON.parse(localStorage.getItem('phone')!);
      var newPassword ={
        mobile:mobile,
        password:this.setNewPasswordForm.value.password,
      }      
      this._auth.changePassword(newPassword).subscribe((result:any)=>{
        if(result.IsSuccess){
          this._sNotify.success('Password change successfully', 'Success');
          this._router.navigate(['/login']);
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

}
