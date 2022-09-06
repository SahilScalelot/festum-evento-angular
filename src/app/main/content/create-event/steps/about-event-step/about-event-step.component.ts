import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl , FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';

@Component({
  selector: 'app-about-event-step',
  templateUrl: './about-event-step.component.html',
  styleUrls: ['./about-event-step.component.scss']
})
export class AboutEventStepComponent implements OnInit {

  aboutEventForm: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    ) {
  }

  ngOnInit(): void {
    this.aboutEventForm = this._formBuilder.group({
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      about_event: [''],
    });
  }
  
  validate(): any {
    console.log(this.aboutEventForm.value.date);
    if (!this.aboutEventForm.value.date || this.aboutEventForm.value.date === "") {
      this._sNotify.error('Date is required!', 'Oops!');
      return false;
    }
    if (!this.aboutEventForm.value.start_time || this.aboutEventForm.value.start_time === "") {
      this._sNotify.error('Start Time is required!', 'Oops!');
      return false;
    }
    if (!this.aboutEventForm.value.end_time || this.aboutEventForm.value.end_time === "") {
      this._sNotify.error('End Time is required!', 'Oops!');
      return false;
    }
    return true;
  }

  next(): void {
    if (!this.validate()) {
      return;
    }
    this._router.navigate(['/create-event/arrangement']);
  }

}
