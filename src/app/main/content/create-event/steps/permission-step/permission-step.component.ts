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

  permissionObj: any = {permission: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.permissionObj = JSON.parse(eventString);
      this.inputText = this.permissionObj?.permission?.permission_letter?.split('\\', 3)[2];
    } else {
      this._router.navigate(['/events']);
    }
    
    this.permissionForm = this._formBuilder.group({
      permission_letter: [null, [Validators.required]],
      accept_booking: [this.permissionObj?.permission?.accept_booking]
    });
  }

  onChangePDF(event: any): void {
    this.inputText = event?.target?.files[0]?.name;
  }

  submitPermissionForm(): void {
    const pdf = $('#permission_letter')[0].files[0];
    if (this.permissionForm.invalid) {
      // this.permissionForm.controls.markAsDirty();
      Object.keys(this.permissionForm.controls).forEach((key) => {
        this.permissionForm.controls[key].touched = true;
        this.permissionForm.controls[key].markAsDirty();
      });
      return;
    }
    // if (pdf != undefined) {
      // this is for upload formData
      // let formData:FormData = new FormData();
      // formData.append('permission_letter', pdf, pdf.name);
      // this.permissionForm.get('permission_letter').setValue(pdf);
    // }
    // localStorage.setItem('newEventObj', JSON.stringify(this.permissionForm.value))
    const preparedObj = this.prepareObj(this.permissionForm.value);
    // this.permissionObj.permission = preparedObj;
    // JSON.stringify({ permission: preparedObj });
    // localStorage.setItem('newEventObj', JSON.stringify(this.permissionObj));
    this._router.navigate(['create-event/discount']);
  }

  prepareObj(permissionObj: any = {}): any {
    const preparedObj: any = permissionObj;
    return preparedObj; 
  }

}
