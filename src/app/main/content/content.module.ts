import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {EventModule} from "./event/event.module";
import {CreateEventModule} from "./create-event/create-event.module";
import { BuySpacePlansComponent } from './buy-space-plans/buy-space-plans.component';
import { ProfileComponent } from './profile/profile.component';
import { ModalModule } from '../_modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OfflineShopsModule } from './offline-shops/offline-shops.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { RedeemCoinComponent } from './redeem-coin/redeem-coin.component';
import { FaqAndHelpComponent } from './faq-and-help/faq-and-help.component';
import { GalleryComponent } from './gallery/gallery.component';
import { OurProductComponent } from './our-product/our-product.component';
import { BookingComponent } from './booking/booking.component';
import { AccordionModule } from 'primeng/accordion';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  }
];

@NgModule({
  declarations: [
    ContentComponent,
    BuySpacePlansComponent,
    ProfileComponent,
    LandingPageComponent,
    ReferAndEarnComponent,
    RedeemCoinComponent,
    FaqAndHelpComponent,
    GalleryComponent,
    OurProductComponent,
    BookingComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    EventModule,
    OfflineShopsModule,
    CreateEventModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    AccordionModule
  ]
})
export class ContentModule {
}
