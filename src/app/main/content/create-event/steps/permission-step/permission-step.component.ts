import {Component, OnInit} from '@angular/core';
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

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    this.permissionForm = this._formBuilder.group({
      permission_letter: [null, [Validators.required]],
      accept_booking: [false]
    });
  }

  onChangePDF(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  submitPermissionForm(): void {
    const pdf = $('#permission_letter')[0].files[0];
    if (pdf != undefined) {
      // this is for upload formData
      // let formData:FormData = new FormData();
      // formData.append('permission_letter', pdf, pdf.name);
      // this.permissionForm.get('permission_letter').setValue(pdf);
    }

    console.log(this.permissionForm.value);
    this._router.navigate(['create-event/discount']);
  }

}
