import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../auth/auth-guard/auth.guard";
import {StepsModule} from "primeng/steps";
import {CreateNewEventComponent} from "./create-new-event.component";
import {AddEventsComponent} from "./steps/add-event-step/add-events.component";
import {AddEventComponent} from "./dialog/add-event/add-event.component";
import {AboutEventsComponent} from "./steps/about-event-step/about-events.component";

const routes: Routes = [
  {path: '', redirectTo: 'add-event', pathMatch: 'full'},
  {
    path: '',
    component: CreateNewEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add-event', component: AddEventsComponent
      },
      {
        path: 'about-event', component: AboutEventsComponent
      },
      {
        path: 'arrangement', component: AddEventsComponent
      },
      {
        path: 'location', component: AddEventsComponent
      },
      {
        path: 'photos-and-videos', component: AddEventsComponent
      },
      {
        path: 'permission', component: AddEventsComponent
      },
      {
        path: 'discount', component: AddEventsComponent
      },
      {
        path: 'about-event', component: AddEventsComponent
      },
      {
        path: 'company-details', component: AddEventsComponent
      },
      {
        path: 'personal-details', component: AddEventsComponent
      },
      {
        path: 'terms-and-conditions', component: AddEventsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CreateNewEventComponent,
    AddEventComponent,
    AddEventsComponent,
    AboutEventsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule
  ]
})
export class CreateNewEventModule {
}
