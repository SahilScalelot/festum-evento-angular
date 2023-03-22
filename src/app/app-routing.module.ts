import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./main/auth/auth-guard/auth.guard";
import { ContentComponent } from "./main/content/content.component";
import { NoAuthGuard } from "./main/auth/auth-guard/noAuth.guard";
import { AuthComponent } from "./main/auth/auth.component";
import { BuySpacePlansComponent } from './main/content/buy-space-plans/buy-space-plans.component';
import { ProfileComponent } from './main/content/profile/profile.component';
import { LandingPageComponent } from './main/content/landing-page/landing-page.component';
import { ShopOverviewComponent } from './main/content/offline-shops/shop-overview/shop-overview.component';
import { OfferOverviewComponent } from './main/content/offline-shops/shop-overview/offer-overview/offer-overview.component';
import { ReferAndEarnComponent } from './main/content/refer-and-earn/refer-and-earn.component';
import { RedeemCoinComponent } from './main/content/redeem-coin/redeem-coin.component';
import { EntertainmentComponent } from './main/content/entertainment/entertainment.component';
import { OurProductComponent } from './main/content/our-product/our-product.component';
import { BookingComponent } from './main/content/booking/booking.component';
import { FaqComponent } from './main/content/faq/faq.component';
import { HelpComponent } from './main/content/help/help.component';
import { PlatformLinksComponent } from './main/content/online-offers/platform_links/platform_links.component';
import { TermsAndConditionsUserComponent } from './main/common/terms-and-conditions-user/terms-and-conditions.component';
import { PrivacyPolicyUserComponent } from './main/common/privacy-policy-user/privacy-policy.component';

const routes: Routes = [

  { path: '', component: LandingPageComponent },
  { path: 'platform/:linkId', component: PlatformLinksComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsUserComponent },
  { path: 'privacy-policy', component: PrivacyPolicyUserComponent },
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
        path: 'register/:agentId',
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
        path: 'events',
        loadChildren: () => import('../app/main/content/event/event.module').then(m => m.EventModule),
        // title: 'Events Box'
      },
      {
        path: 'events/create',
        loadChildren: () => import('../app/main/content/create-event/create-event.module').then(m => m.CreateEventModule)
      },
      {
        path: 'edit-event/:id',
        loadChildren: () => import('../app/main/content/create-event/create-event.module').then(m => m.CreateEventModule)
      },
      {
        path: 'offline-shops',
        loadChildren: () => import('./main/content/offline-shops/offline-shops.module').then(m => m.OfflineShopsModule)
      },
      {
        path: 'offline-shops/:shopId',
        component: ShopOverviewComponent
      },
      {
        path: 'offline-shops/:shopId/offer-overview/:offerId',
        component: OfferOverviewComponent
      },
      {
        path: 'online-offers',
        loadChildren: () => import('./main/content/online-offers/online-offers.module').then(m => m.OnlineOffersModule)
      },
      {
        path: 'live-stream',
        loadChildren: () => import('./main/content/live-stream/live-stream.module').then(m => m.LiveStreamModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./main/content/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'refer-and-earn',
        component: ReferAndEarnComponent
      },
      {
        path: 'redeem',
        component: RedeemCoinComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'ask-srivalli',
        component: HelpComponent
      },
      {
        path: 'entertainment',
        component: EntertainmentComponent
      },
      {
        path: 'our-product',
        component: OurProductComponent
      },
      {
        path: 'booking',
        component: BookingComponent
      },
      {
        path: 'buy-space-plans',
        component: BuySpacePlansComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  { path: '**', redirectTo: '/events' },
];
// , { useHash: true }
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
