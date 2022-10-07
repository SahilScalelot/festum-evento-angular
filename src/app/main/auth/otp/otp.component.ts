import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent implements OnInit {

  otp = new FormControl('');

  ngOnInit() {
    this.otp.addValidators([Validators.required, Validators.minLength(6)])
  }

  constructor(
  ) {
  }

  verifyOtp(): void {
    console.log(this.otp);
  }

  onOtpChange(event: any) {
    if (event.length == 6) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
    }
  }

}
