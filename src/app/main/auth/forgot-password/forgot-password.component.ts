import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  phone: FormControl | any;

  constructor(
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.phone = new FormControl('');
    this.phone.addValidators([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]);
  }

  sendVerificationCode(): any {
    if (!this.phone.invalid) {
      localStorage.setItem('fPMob', this.phone.value);
      this._router.navigate(['/otp']);
    }
  }
}
