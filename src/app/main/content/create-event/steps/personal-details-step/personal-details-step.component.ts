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
  
  personalObj: any = {personal_details: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.personalObj = JSON.parse(eventString);
    }
    console.log();

    this.personalDetailForm = this._formBuilder.group({
      full_name: [this.personalObj?.personal_details?.full_name, [Validators.required]],
      mobile: [this.personalObj?.personal_details?.mobile, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      mobile_hidden: [this.personalObj?.personal_details?.mobile_hidden],
      alternate_mobile: [this.personalObj?.personal_details?.alternate_mobile, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      alternate_mobile_hidden: [this.personalObj?.personal_details?.alternate_mobile_hidden],
      email: [this.personalObj?.personal_details?.email, [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email_hidden: [this.personalObj?.personal_details?.email_hidden],
      flat_number: [this.personalObj?.personal_details?.flat_number],
      street_name: [this.personalObj?.personal_details?.street_name],
      area_name: [this.personalObj?.personal_details?.area_name],
      state: [this.personalObj?.personal_details?.state, [Validators.required]],
      city: [this.personalObj?.personal_details?.city, [Validators.required]],
      pincode: [this.personalObj?.personal_details?.pincode, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
  }

  personalDetail(): any {
    console.log(this.personalDetailForm.valid)
    console.log(this.personalDetailForm)

    if (this.personalDetailForm.invalid) {
      // this.personalDetailForm.controls.markAsDirty();
      Object.keys(this.personalDetailForm.controls).forEach((key) => {
        this.personalDetailForm.controls[key].touched = true;
        this.personalDetailForm.controls[key].markAsDirty();
      });
      return;
    }

    const preparedObj = this.prepareObj(this.personalDetailForm.value);
    this.personalObj.personal_details = preparedObj;
    
    JSON.stringify({personal_details: preparedObj});
    localStorage.setItem('newEventObj', JSON.stringify(this.personalObj));
    this._router.navigate(['create-event/terms-and-conditions']);
  }

  prepareObj(personalObj: any = {}): any {
    const preparedObj: any = personalObj;
    return preparedObj;
  }
}