import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SetNewPasswordComponent} from "./set-new-password.component";

const routes: Routes = [
  {path: '', component: SetNewPasswordComponent},
];

@NgModule({
  declarations: [
    SetNewPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SetNewPasswordModule {
}
