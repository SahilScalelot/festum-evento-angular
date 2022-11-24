import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CONSTANTS} from "../../../../common/constants";
import {FormBuilder, Validators} from "@angular/forms";
import {SnotifyService} from "ng-snotify";
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-permission-step',
  templateUrl: './permission-step.component.html',
  styleUrls: ['./permission-step.component.scss']
})
export class PermissionStepComponent implements OnInit {
  permissionForm: any;
  inputText: any;
  constants: any = CONSTANTS;

  @Input() eventObj: any = {};
  @Output() newEventObj: EventEmitter<any> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('eId') || localStorage.getItem('eId') == '') {
      this._router.navigate(['/events']);
    }
    this.permissionForm = this._formBuilder.group({
      permission_letter: [null],
      accept_booking: [this.eventObj?.permission?.accept_booking || false]
    });
    this.inputText = this.eventObj?.permission?.permission_letter_name;
  }

  onChangePDF(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  submitPermissionForm(): void {
    this.permissionForm.get('permission_letter').setErrors({'required': false});
    if (((!this.eventObj || !this.eventObj.permission || !this.eventObj.permission.permission_letter) &&
      (!this.permissionForm.value || !this.permissionForm.value.permission_letter)) ||
      (this.eventObj && this.eventObj.permission && (!this.eventObj.permission.permission_letter ||
        typeof (this.eventObj.permission.permission_letter) != 'object'))) {
      // this.permissionForm.controls.markAsDirty();
      Object.keys(this.permissionForm.controls).forEach((key) => {
        this.permissionForm.controls[key].touched = true;
        this.permissionForm.controls[key].markAsDirty();
      });
      this.permissionForm.get('permission_letter').setErrors({'required': true});
      return;
    }
    // if (pdf != undefined) {
      // this is for upload formData
      // let formData:FormData = new FormData();
      // formData.append('permission_letter', pdf, pdf.name);
      // this.permissionForm.get('permission_letter').setValue(pdf);
    // }
    // localStorage.setItem('newEventObj', JSON.stringify(this.permissionForm.value))
    this.eventObj.permission = this.preparePermissionObj(this.permissionForm.value);
    // JSON.stringify({ permission: preparedObj });
    // localStorage.setItem('newEventObj', JSON.stringify(this.permissionObj));
    this.newEventObj.emit(this.eventObj);
    this._router.navigate(['create-event/discount']);
  }

  preparePermissionObj(permissionObj: any = {}): any {
    const preparedPermissionObj: any = permissionObj;
    const pdf = $('#permission_letter')[0].files[0];
    if (pdf != undefined) {
      preparedPermissionObj.permission_letter = pdf;
      preparedPermissionObj.permission_letter_name = pdf.name;
    } else if (this.eventObj?.permission?.permission_letter) {
      preparedPermissionObj.permission_letter = this.eventObj?.permission?.permission_letter;
      preparedPermissionObj.permission_letter_name = preparedPermissionObj.permission_letter.name;
    }
    return preparedPermissionObj;
  }

}
