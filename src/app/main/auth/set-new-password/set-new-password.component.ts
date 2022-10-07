import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FuseValidators} from "../validators";

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
    private _router: Router
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
      // console.log(this.setNewPasswordForm);
      this._router.navigate(['/login']);
    }
  }

}
