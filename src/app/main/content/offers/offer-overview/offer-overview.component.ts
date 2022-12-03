import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import * as _ from 'lodash';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit {
  addOfferForm: any;
  constants: any = CONSTANTS;

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this._prepareAddOfferForm();
    // get function ma response ne prepare karti vakhate
    // this.offerOnAllProducts.setValue([(preparedOfferObj.offer_on_all_products) ? 'true' : '']);
  }

  get offerOnAllProducts(): any {
    return this.addOfferForm.get('offer_on_all_products');
  }

  get allProductConditions(): any {
    return this.addOfferForm.get('all_product_conditions') as FormArray;
  }

  popupOpen(popId: string): void {
    this._modalService.open(popId);
  }

  addEditOffer(): any {
    const preparedOfferObj: any = this.prepareOfferObj(this.addOfferForm.value);
    console.log(preparedOfferObj);
  }

  addProductLimitation(productLimitationObj: any = {}): void {
    if (this.allProductConditions.length < CONSTANTS.maxOfferOnAllProductsLimit) {
      const productLimitation: any = this._formBuilder.group({
        person_limitation: [productLimitationObj?.person_limitation || ''],
        discount: [productLimitationObj?.discount || ''],
        discount_type: [productLimitationObj?.discount_type || CONSTANTS.discountTypeArr[CONSTANTS.discountTypeObj.percentage].value]
      });
      this.allProductConditions.push(productLimitation);
    }
  }

  removeProductLimitation(index: any): void {
    if (this.allProductConditions.get(index.toString())) {
      this.allProductConditions.removeAt(index.toString());
      this.allProductConditions.updateValueAndValidity();
    }
  }

  prepareOfferObj(offerFormObj: any = {}): any {
    const offerObj = this._globalFunctions.copyObject(offerFormObj);
    offerObj.offer_on_all_products = !!(offerFormObj && offerFormObj.offer_on_all_products && offerFormObj.offer_on_all_products.length  && (offerFormObj.offer_on_all_products[0] == 'true' || offerFormObj.offer_on_all_products[0] == true));

    return offerObj;
  }

  private _prepareAddOfferForm(offerObj: any = {}): void {
    this.addOfferForm = this._formBuilder.group({
      // offerid: [""],
      offer_title: [""],
      start_date: [""],
      end_date: [""],
      poster: [""],
      video: [""],
      description: [""],
      status: [""],
      offer_on_all_products: [''],
      all_product_images: [],
      all_product_conditions: this._formBuilder.array([]),
      offer_type: [""],
      // offer_type_conditions: [],
      tandc: [""],
    });

    if (offerObj && offerObj.arrangements) {
      _.each(offerObj.all_product_conditions, (productOffer: any) => {
        this.addProductLimitation(productOffer);
      });
    } else {
      this.addProductLimitation();
    }
  }
}
