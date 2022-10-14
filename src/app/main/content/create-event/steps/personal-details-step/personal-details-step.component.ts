import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-personal-details-step',
  templateUrl: './personal-details-step.component.html',
  styleUrls: ['./personal-details-step.component.scss'],
})
export class PersonalDetailsStepComponent implements OnInit {
  personalDetailForm: any;
  submit: boolean = false;

  eventObj: any = {};
  
  personalObj: any = {personal_details: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this._prepareAboutEventForm();
    this.prepareEventObj();
  }

  prepareEventObj(): void {
    // if (localStorage.getItem('newEventObj')) {
    //   const eventString: any = localStorage.getItem('newEventObj');
    //   this.personalObj = JSON.parse(eventString);
    // } else {
    //   this._router.navigate(['/events']);
    // }
    this._globalService.addEditEvent$.subscribe((eventObj: any) => {
      if (eventObj) {
        this.eventObj = eventObj;
        this._prepareAboutEventForm(this.eventObj);
      }
    });
    if (!this.eventObj || !this.eventObj.add_event) {
      // this._router.navigate(['/events']);
    }
  }

  private _prepareAboutEventForm(eventObj: any = {}): void {
    this.personalDetailForm = this._formBuilder.group({
      full_name: [eventObj?.personal_details?.full_name, [Validators.required]],
      mobile: [eventObj?.personal_details?.mobile, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      mobile_hidden: [eventObj?.personal_details?.mobile_hidden],
      alternate_mobile: [eventObj?.personal_details?.alternate_mobile, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      alternate_mobile_hidden: [eventObj?.personal_details?.alternate_mobile_hidden],
      email: [eventObj?.personal_details?.email, [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email_hidden: [eventObj?.personal_details?.email_hidden],
      flat_number: [eventObj?.personal_details?.flat_number],
      street_name: [eventObj?.personal_details?.street_name],
      area_name: [eventObj?.personal_details?.area_name],
      state: [eventObj?.personal_details?.state, [Validators.required]],
      city: [eventObj?.personal_details?.city, [Validators.required]],
      pincode: [eventObj?.personal_details?.pincode, [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]],
    });
  }
  personalDetail(): any {
    if (this.personalDetailForm.invalid) {
      // this.personalDetailForm.controls.markAsDirty();
      Object.keys(this.personalDetailForm.controls).forEach((key) => {
        this.personalDetailForm.controls[key].touched = true;
        this.personalDetailForm.controls[key].markAsDirty();
      });
      return;
    }

    this.eventObj.personal_details = this.prepareObj(this.personalDetailForm.value);
    // localStorage.setItem('newEventObj', JSON.stringify(this.eventObj));
    
    console.log(this.eventObj);
    this._globalService.addEditEvent$.next(this.eventObj);  
    this._router.navigate(['create-event/terms-and-conditions']);
  }

  prepareObj(personalObj: any = {}): any {
    const preparedObj: any = personalObj;
    return preparedObj;
  }
}