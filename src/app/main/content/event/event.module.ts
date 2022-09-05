import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from "./event.component";
import {AuthGuard} from "../../auth/auth-guard/auth.guard";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import { EventOverviewComponent } from './event-overview/event-overview.component';

const routes: Routes = [
  {
    path: '', component: EventComponent, canActivate: [AuthGuard]
  },
  {
    path: 'event-overview', component: EventOverviewComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    EventComponent,
    EventOverviewComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EventModule {
}
