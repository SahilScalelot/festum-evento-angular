import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../auth/auth-guard/auth.guard";
import {StepsModule} from "primeng/steps";
import {CreateEventComponent} from "./create-event.component";
import {AddEventComponent} from "./steps/add-event-step/add-event.component";
import {AboutEventsComponent} from "./steps/about-event-step/about-events.component";
import {TooltipModule} from 'primeng/tooltip';
import {SharedModule} from "../../../shared/shared.module";


const routes: Routes = [
  {path: '', redirectTo: 'add-event', pathMatch: 'full'},
  {
    path: '',
    component: CreateEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add-event', component: AddEventComponent
      },
      {
        path: 'about-event', component: AboutEventsComponent
      },
      {
        path: 'arrangement', component: AddEventComponent
      },
      {
        path: 'location', component: AddEventComponent
      },
      {
        path: 'photos-and-videos', component: AddEventComponent
      },
      {
        path: 'permission', component: AddEventComponent
      },
      {
        path: 'discount', component: AddEventComponent
      },
      {
        path: 'about-event', component: AddEventComponent
      },
      {
        path: 'company-details', component: AddEventComponent
      },
      {
        path: 'personal-details', component: AddEventComponent
      },
      {
        path: 'terms-and-conditions', component: AddEventComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CreateEventComponent,
    AddEventComponent,
    AboutEventsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule,
    TooltipModule,
    SharedModule
  ]
})
export class CreateEventModule {
}
