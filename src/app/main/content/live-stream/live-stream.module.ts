import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LiveStreamComponent } from './live-stream.component';
import { StreamOverviewComponent } from './stream-overview/stream-overview.component';

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
    StreamOverviewComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class LiveStreamModule { }
