import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FuseValidators} from "../validators";
import {AuthService} from "../../auth/auth.service"

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {
  setNewPasswordForm: FormGroup | any;
  pwd: boolean = false;
  confirmPwd: boolean = false;

  get password(): any {
    return this.setNewPasswordForm.get('password');
  }

  get confirmPassword(): any {
    return this.setNewPasswordForm.get('confirm_password');
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth:AuthService
  ) {
  }

  ngOnInit(): void {
    this.setNewPasswordForm = this._formBuilder.group({
      // mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validators: FuseValidators.mustMatch('password', 'confirm_password')
    });
  }

  setNewPassword(): void {
    if (!this.setNewPasswordForm.invalid) {
      var mobile = JSON.parse(localStorage.getItem('fPMob')!);
      var newPassword ={
        mobile:mobile,
        password:this.setNewPasswordForm.value.password,
        confirm_password:this.setNewPasswordForm.value.confirm_password
      }
      console.log(mobile)
      // console.log(this.setNewPasswordForm.value.password)
      this._auth.changePassword(newPassword).subscribe((res:any)=>{
        if(res.status){
          console.log('password changed')
          this._router.navigate(['/login']);
        }
      })
      
    }
  }

}
