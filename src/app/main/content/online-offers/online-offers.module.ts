import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnlineOffersComponent } from './online-offers.component';
import { OfferOverviewComponent } from './offer-overview/offer-overview.component';
import { CreateOfferComponent } from './create-offer/create-offer.component';

const routes: Routes = [
  {
    path: '', component: OnlineOffersComponent
  },
  {
    path: 'create-offer', component: CreateOfferComponent
  },
  {
    path: 'offer-overview', component: OfferOverviewComponent
  }
];

@NgModule({
  declarations: [
    OnlineOffersComponent,
    OfferOverviewComponent,
    CreateOfferComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class OnlineOffersModule { }
