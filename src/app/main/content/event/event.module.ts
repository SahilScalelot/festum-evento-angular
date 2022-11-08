import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from "./event.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {EventOverviewComponent} from './event-overview/event-overview.component';
import {RatingModule} from 'primeng/rating';
import {CheckboxModule} from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';

const routes: Routes = [
  {
    path: '', component: EventComponent
  },
  {
    path: 'event-overview', component: EventOverviewComponent
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
    SharedModule,
    RatingModule,
    CheckboxModule,
    PaginatorModule
  ]
})
export class EventModule {
}
