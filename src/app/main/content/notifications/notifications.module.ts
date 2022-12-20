import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { CreateNotificationsComponent } from './create-notifications/create-notifications.component';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ModalModule } from "../../_modal";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    ModalModule,
    CKEditorModule,
    ReactiveFormsModule,
    PaginatorModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
  ]
})
export class NotificationsModule { }
