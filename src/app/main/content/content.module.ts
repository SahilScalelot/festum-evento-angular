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
import { OffersComponent } from './offers/offers.component';

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
    OffersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    EventModule,
    CreateEventModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ProgressSpinnerModule
  ]
})
export class ContentModule {
}
