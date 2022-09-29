import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-personal-details-step',
  templateUrl: './personal-details-step.component.html',
  styleUrls: ['./personal-details-step.component.scss'],
})
export class PersonalDetailsStepComponent implements OnInit {
  personalDetailForm: any;
  submit: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService
  ) {}

  ngOnInit(): void {
    this._preparePersonalDetailForm();
  }

  private _preparePersonalDetailForm(): void {
    this.personalDetailForm = this._formBuilder.group({
      full_name: [null, [Validators.required]],
      mobile: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      mobile_hidden: [false],
      alternate_mobile: [null],
      alternate_mobile_hidden: [false],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      email_hidden: [false],
      flat_number: [null],
      street_name: [null],
      area_name: [null],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pincode: [null, [Validators.required, Validators.maxLength(6)]],
    });
  }

  // get full_name() {
  //   return this.personalDetailForm.get('full_name');
  // }
  // get mobile() {
  //   return this.personalDetailForm.get('mobile');
  // }
  // get email() {
  //   return this.personalDetailForm.get('email');
  // }
  // get state() {
  //   return this.personalDetailForm.get('state');
  // }
  // get city() {
  //   return this.personalDetailForm.get('city');
  // }
  // get pincode() {
  //   return this.personalDetailForm.get('pincode');
  // }

  personalDetail(): any {
    console.log(this.personalDetailForm.valid)
    console.log(this.personalDetailForm)
      if (!this.personalDetailForm.valid) {
        return;
      }
      this._router.navigate(['create-event/terms-and-conditions']);
}
}

// validate(): any {
//   if (!this.personalDetailForm.get('full_name').valid) {
//     // console.log(this.personalDetailForm.controls.full_name.status)
//     this._sNotify.error('Please enter valid name', 'Oops!');
//     return false;
//     // this._router.navigate(['create-event/personal-details'])
//   }

//   if (!this.personalDetailForm.get('full_name').valid) {
//     this._sNotify.error('Please enter valid Number', 'Oops!');
//     return false;
//   }

//   if (!this.personalDetailForm.get('email').valid) {
//     this._sNotify.error('please enter valid email', 'Oops!');
//     return false;
//   }

//   if (!this.personalDetailForm.get('city').valid) {
//     this._sNotify.error('city Not valid', 'Oops!');
//     return false;
//   }

//   if (!this.personalDetailForm.get('state').valid) {
//     this._sNotify.error('state Not valid', 'Oops!');
//     return false;
//   }

//   if (!this.personalDetailForm.get('pincode').valid) {
//     this._sNotify.error('pincode Not valid', 'Oops!');
//     return false;
//   }
//   return true;
// }

// personalDetail(): any {
//   if (!this.validate()) {
//     return;
//   }
//   this._router.navigate(['create-event/terms-and-conditions']);

//   // if(this.personalDetailForm.full_name.invalid){
//   //   this._sNotify.error('Name is requred', 'Oops!');
//   //   return false;
//   // }
// }
