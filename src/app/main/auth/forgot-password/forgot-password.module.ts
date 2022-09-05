import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ForgotPasswordComponent} from "./forgot-password.component";

const routes: Routes = [
  {path: '', component: ForgotPasswordComponent},
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ForgotPasswordModule {
}
