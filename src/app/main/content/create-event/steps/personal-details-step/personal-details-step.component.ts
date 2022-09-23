import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-personal-details-step',
  templateUrl: './personal-details-step.component.html',
  styleUrls: ['./personal-details-step.component.scss']
})
export class PersonalDetailsStepComponent implements OnInit {
  personalDetailForm: any;

  constructor(
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this._preparePersonalDetailForm();
  }

  private _preparePersonalDetailForm(): void {
    this.personalDetailForm = this._formBuilder.group({
      full_name: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      mobile_hidden: [false],
      alternate_mobile: [null],
      alternate_mobile_hidden: [false],
      email: [null, [Validators.required]],
      email_hidden: [false],
      flat_number: [null],
      street_name: [null],
      area_name: [null],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pincode: [null, [Validators.required, Validators.maxLength(6)]],
    });
  }

}
