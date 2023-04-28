import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register.component";
import { SharedModule } from "../../../shared/shared.module";
import { ModalModule } from '../../_modal';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

const routes: Routes = [
  { path: '', component: RegisterComponent },
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    NgxIntlTelInputModule
  ]
})
export class RegisterModule {
}
