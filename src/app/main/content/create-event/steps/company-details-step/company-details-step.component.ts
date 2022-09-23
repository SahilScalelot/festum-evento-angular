import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';

@Component({
  selector: 'app-company-details-step',
  templateUrl: './company-details-step.component.html',
  styleUrls: ['./company-details-step.component.scss']
})
export class CompanyDetailsStepComponent implements OnInit {

  companyForm: any;
  inputText:any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService
  ) { }

  ngOnInit(): void {
    this.companyForm = this._formBuilder.group({
      name: ['', Validators.required],
      gst: [''],
      contact_no: ['', Validators.required],
      email: ['', Validators.required],
      about: [''],
      flat_no: [''],
      street: [''],
      area: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
    });
  }

  validate(): boolean {
    if (!this.companyForm.value.name || this.companyForm.value.name === "") {
      this._sNotify.error('Name is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.contact_no || this.companyForm.value.contact_no === "") {
      this._sNotify.error('Contact No is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.email || this.companyForm.value.email === "") {
      this._sNotify.error('Email is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.city || this.companyForm.value.city === "") {
      this._sNotify.error('City is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.state || this.companyForm.value.state === "") {
      this._sNotify.error('State is required!', 'Oops!');
      return false;
    }
    if (!this.companyForm.value.pincode || this.companyForm.value.pincode === "") {
      this._sNotify.error('Pincode is required!', 'Oops!');
      return false;
    }
    return true;
  }

  register(): void {
    // console.log(this.companyForm.value);
    // if (this.companyForm.invalid) {
    //   return;
    // }
    
    if (!this.validate()) {
      return;
    }
    console.log(this.companyForm.value);
  }

  readURL(event: any):void {
    // if(event && event.target && event.target.files && event.target.files.length && event.target.files[0].name){
      this.inputText = event?.target?.files[0]?.name;
    // } else {
      // this.inputText = "";
    // }
  }
}
