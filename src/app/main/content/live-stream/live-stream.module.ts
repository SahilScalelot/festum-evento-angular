import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Routes } from '@angular/router';
import { LiveStreamComponent } from './live-stream.component';
import { StreamOverviewComponent } from './stream-overview/stream-overview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { ModalModule } from '../../_modal';
import { SharedModule } from "../../../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { Time24to12Format } from 'src/app/pipe/time24to12.pipe';
import { MatIconModule } from "@angular/material/icon";
import { BroadcastStreamComponent } from './broadcast-stream/broadcast-stream.component';

const routes: Routes = [
  {
    path: '', component: LiveStreamComponent
  },
  {
    path: ':id', component: StreamOverviewComponent
  },
  {
    path: 'broadcast/:id', component: BroadcastStreamComponent
  }
];

@NgModule({
  declarations: [
    LiveStreamComponent,
    StreamOverviewComponent,
    Time24to12Format,
    BroadcastStreamComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    CalendarModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    PaginatorModule,
    ImageModule,
    RatingModule,
    MatIconModule
  ]
})
export class LiveStreamModule { }
