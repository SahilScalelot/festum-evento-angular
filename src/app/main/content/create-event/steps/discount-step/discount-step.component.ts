import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from 'src/app/main/_modal';
import { CreateEventService } from '../../create-event.service';

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
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService, 
  ) {
  }

  ngOnInit(): void {

    this.discountForm = this._formBuilder.group({
      video: [null, [Validators.required]],
      details: [null]
    });

  }

  onFileChange(): void {
    this._modalService.open("Discount");
  }
  
  multipleLiveEvent(event: any): void {
    event.stopPropagation();
  }

  submitDiscount(): any {
    this._modalService.close("Discount");
  }
  
  closePop(): any {
    this._modalService.close("Discount");
  }
}
