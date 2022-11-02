import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {SetNewPasswordComponent} from './set-new-password/set-new-password.component';
import {AuthService} from './auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {OtpModule} from "./otp/otp.module";
import {ForgotPasswordModule} from "./forgot-password/forgot-password.module";
import {SetNewPasswordModule} from "./set-new-password/set-new-password.module";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent
  }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    LoginModule,
    RegisterModule,
    OtpModule,
    ForgotPasswordModule,
    SetNewPasswordModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {
}
