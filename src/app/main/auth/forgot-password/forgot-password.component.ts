import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service"

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  phone: FormControl | any;

  constructor(
    private _router: Router, private _auth:AuthService
  ) {
  }

  ngOnInit(): void {
    this.phone = new FormControl('');
    this.phone.addValidators([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
  }

  sendVerificationCode(): any {
    console.log(this.phone.value)
    var forgotPwd={
      mobile:this.phone.value
    }
    this._auth.forgotPassword(forgotPwd).subscribe((result:any)=>{
      console.log(121,result)
      localStorage.setItem('forgot1',JSON.stringify(result));
    })

    if (!this.phone.invalid) {
      localStorage.setItem('fPMob', this.phone.value);
      this._router.navigate(['/otp']);
    }
  }
}
