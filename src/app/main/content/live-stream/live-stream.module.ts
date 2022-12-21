import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LiveStreamComponent } from './live-stream.component';
import { StreamOverviewComponent } from './stream-overview/stream-overview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { ModalModule } from '../../_modal';
import { SharedModule } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';

const routes: Routes = [
  {
    path: '', component: LiveStreamComponent
  },
  {
    path: ':id', component: StreamOverviewComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./create-stream/create-stream.module').then(m => m.CreateStreamModule)
  }
];

@NgModule({
  declarations: [
    LiveStreamComponent,
    StreamOverviewComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    PaginatorModule,
    ImageModule,
    RatingModule
  ]
})
export class LiveStreamModule { }
