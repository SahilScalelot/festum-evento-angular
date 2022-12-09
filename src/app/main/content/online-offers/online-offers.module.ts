import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OnlineOffersComponent } from './online-offers.component';
import { OfferOverviewComponent } from './offer-overview/offer-overview.component';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";

const routes: Routes = [
  {
    path: '', component: OnlineOffersComponent
  },
  {
    path: 'create-offer', component: CreateOfferComponent
  },
  {
    path: ':id', component: OfferOverviewComponent
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
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class OnlineOffersModule { }
