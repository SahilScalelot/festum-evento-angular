import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { CreateNotificationsComponent } from './create-notifications/create-notifications.component';
import { PromoteComponent } from './promote/promote.component';

const routes: Routes = [
  {
    path: '', component: NotificationsComponent
  },
  {
    path: 'create', component: CreateNotificationsComponent
  },
  {
    path: ':id', component: CreateNotificationsComponent
  }
];

@NgModule({
  declarations: [
    NotificationsComponent,
    CreateNotificationsComponent,
    PromoteComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class NotificationsModule { }
