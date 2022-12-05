import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {OfferOverviewComponent} from './offer-overview/offer-overview.component';
import {OffersComponent} from './offers.component';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../_modal';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CalendarModule } from 'primeng/calendar';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    ImageCropperModule,
    CalendarModule,
    RatingModule,
    PaginatorModule,
    CheckboxModule,
    ProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q',
      libraries: ['places']
    }),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OffersModule { }
