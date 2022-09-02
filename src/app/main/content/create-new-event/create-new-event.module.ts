import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../auth/auth-guard/auth.guard";
import {StepsModule} from "primeng/steps";
import {CreateNewEventComponent} from "./create-new-event.component";
import {AddEventsComponent} from "./steps/add-event-step/add-events.component";
import {AddEditEventComponent} from "./dialog/add-edit-event/add-edit-event.component";
import {AboutEventsComponent} from "./steps/about-event-step/about-events.component";
import {TooltipModule} from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';


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
    AddEditEventComponent,
    AddEventsComponent,
    AboutEventsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule,
    TooltipModule,
    ReactiveFormsModule
  ]
})
export class CreateNewEventModule {
}
