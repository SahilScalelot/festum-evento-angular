import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from 'src/app/main/_modal';

@Component({
  selector: 'app-discount-step',
  templateUrl: './discount-step.component.html',
  styleUrls: ['./discount-step.component.scss']
})
export class DiscountStepComponent implements OnInit {

  discountForm: any;

  constructor(
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService
  ) {
  }

  ngOnInit(): void {

    this.discountForm = this._formBuilder.group({
      video: [null, [Validators.required]],
      details: [null]
    });

  }

  async onFileChange(event: any, imageFor: string, key = 0) {
    this._modalService.open("Discount");
  }

  submitDiscount(): any {
    this._modalService.close("Discount");
  }
  
  closePop(): any {
    this._modalService.close("Discount");
  }
}
