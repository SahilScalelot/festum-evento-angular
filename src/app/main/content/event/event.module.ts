import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from "./event.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { EventOverviewComponent } from './event-overview/event-overview.component';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { AgmCoreModule } from '@agm/core';
import { ImageModule } from 'primeng/image';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '', component: EventComponent
  },
  {
    path: ':id', component: EventOverviewComponent
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
    PaginatorModule,
    ImageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q',
      libraries: ['places']
    }),
    TranslateModule,
  ]
})
export class EventModule {
}
