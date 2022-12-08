import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {
  createOfferForm: any;
  offerId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('oOId') || localStorage.getItem('oOId') == '') {
      this._router.navigate(['/online-offers']);
    }
    this.offerId = localStorage.getItem('oOId');

  }

  private _prepareCreateOfferForm(personalDetailsObj: any = {}): void {
    this.createOfferForm = this._formBuilder.group({
      offerid: [this.offerId || ''],
      shop_name: [personalDetailsObj?.shop_name || '', [Validators.required]],
      offer_amount: [personalDetailsObj?.offer_amount || '', [Validators.required]],
      offer_type: [personalDetailsObj?.offer_type || '', [Validators.required]],
      start_date: [personalDetailsObj?.start_date || '', [Validators.required]],
      end_date: [personalDetailsObj?.end_date || '', [Validators.required]],
      product_name: [personalDetailsObj?.product_name || '', [Validators.required]],
      poster: [personalDetailsObj?.poster || '', [Validators.required]],
      images: [personalDetailsObj?.images || '', [Validators.required]],
      description: [personalDetailsObj?.description || '', [Validators.required]],
      status: [personalDetailsObj?.status || '', [Validators.required]],
      product_links: [personalDetailsObj?.product_links || '', [Validators.required]],
      company_name: [personalDetailsObj?.company_name || '', [Validators.required]],
      company_gst: [personalDetailsObj?.company_gst || '', [Validators.required]],
      company_contact_no: [personalDetailsObj?.company_contact_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      company_email: [personalDetailsObj?.company_email || '', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      about_company: [personalDetailsObj?.about_company || '', [Validators.required]],
      tandc: [personalDetailsObj?.tandc || '', [Validators.required]],
    });
  }
}
