import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {EventModule} from "./event/event.module";
import {CreateEventModule} from "./create-event/create-event.module";
import { BuySpacePlansComponent } from './buy-space-plans/buy-space-plans.component';
import { ProfileComponent } from './profile/profile.component';
import { ModalModule } from '../_modal';

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
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    EventModule,
    CreateEventModule,
    ModalModule,
  ]
})
export class ContentModule {
}
