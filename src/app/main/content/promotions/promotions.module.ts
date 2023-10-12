import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { PromotionsComponent } from './promotions.component';
import { CreatePromotionsComponent } from './create-promotions/create-promotions.component';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ModalModule } from "../../_modal";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '', component: PromotionsComponent
  },
  {
    path: 'create', component: CreatePromotionsComponent
  },
  {
    path: 'promote',
    loadChildren: () => import('./promote/promote.module').then(m => m.PromoteModule)
  }
];

@NgModule({
  declarations: [
    PromotionsComponent,
    CreatePromotionsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    ModalModule,
    CKEditorModule,
    ReactiveFormsModule,
    PaginatorModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
  ]
})
export class PromotionsModule { }
