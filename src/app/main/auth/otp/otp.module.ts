import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OtpComponent} from "./otp.component";
import { NgOtpInputModule } from  'ng-otp-input';

const routes: Routes = [
  {path: '', component: OtpComponent},
];

@NgModule({
  declarations: [
    OtpComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule
  ]
})
export class OtpModule {
}
