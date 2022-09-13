import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./main/auth/auth-guard/auth.guard";
import {ContentComponent} from "./main/content/content.component";
import {NoAuthGuard} from "./main/auth/auth-guard/noAuth.guard";
import {AuthComponent} from "./main/auth/auth.component";
import { EventOverviewComponent } from './main/content/event/event-overview/event-overview.component';
import { BuySpacePlansComponent } from './main/content/buy-space-plans/buy-space-plans.component';

const routes: Routes = [

  { path: '', redirectTo: 'event', pathMatch: 'full' },
  {
    path: '',
    canActivate: [NoAuthGuard],
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../app/main/auth/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../app/main/auth/register/register.module').then(m => m.RegisterModule)
      },
      {
        path: 'otp',
        loadChildren: () => import('../app/main/auth/otp/otp.module').then(m => m.OtpModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('../app/main/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      },
      {
        path: 'set-new-password',
        loadChildren: () => import('../app/main/auth/set-new-password/set-new-password.module').then(m => m.SetNewPasswordModule)
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: ContentComponent,
    children: [
      {
        path: 'event',
        loadChildren: () => import('../app/main/content/event/event.module').then(m => m.EventModule)
      },
      {
        path: 'event/:id',
        component: EventOverviewComponent
      },
      {
        path: 'create-event',
        loadChildren: () => import('../app/main/content/create-event/create-event.module').then(m => m.CreateEventModule)
      },
      {
        path: 'buy-space-plans',
        component: BuySpacePlansComponent
      }
    ]
  },
  { path: '**', redirectTo: '/event' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
