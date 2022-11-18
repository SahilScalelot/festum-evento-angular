import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {OfferOverviewComponent} from './offer-overview/offer-overview.component';
import {OffersComponent} from './offers.component';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../_modal';

const routes: Routes = [
  {
    path: '', component: OffersComponent
  },
  {
    path: 'offline-shop-offers-overview', component: OfferOverviewComponent
  }
];

@NgModule({
  declarations: [
    OfferOverviewComponent,
    OffersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q',
      libraries: ['places']
    }),
  ]
})
export class OffersModule { }
