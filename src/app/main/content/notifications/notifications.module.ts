import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { CreateNotificationsComponent } from './create-notifications/create-notifications.component';
import { PaginatorModule } from 'primeng/paginator';

const routes: Routes = [
  {
    path: '', component: NotificationsComponent
  },
  {
    path: 'create', component: CreateNotificationsComponent
  },
  {
    path: 'promote',
    loadChildren: () => import('./promote/promote.module').then(m => m.PromoteModule)
  }
];

@NgModule({
  declarations: [
    NotificationsComponent,
    CreateNotificationsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    PaginatorModule
  ]
})
export class NotificationsModule { }
