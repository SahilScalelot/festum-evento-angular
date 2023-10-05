import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';
import { EventModule } from "./event/event.module";
import { CreateEventModule } from "./create-event/create-event.module";
import { CreateStreamModule } from "./create-stream/create-stream.module";
import { BuySpacePlansComponent } from './buy-space-plans/buy-space-plans.component';
import { ProfileComponent } from './profile/profile.component';
import { ModalModule } from '../_modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OfflineShopsModule } from './offline-shops/offline-shops.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { RedeemCoinComponent } from './redeem-coin/redeem-coin.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { OurProductComponent } from './our-product/our-product.component';
import { BookingComponent } from './booking/booking.component';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FaqComponent } from './faq/faq.component';
import { TranslateModule } from "@ngx-translate/core";
import { RatingModule } from 'primeng/rating';
import { SwiperModule } from 'swiper/angular';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { HelpModule } from './help/help.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search/search.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatIconModule } from "@angular/material/icon";
import { MyPostsComponent } from './my-posts/my-posts.component';
import { QRCodeModule } from 'angularx-qrcode';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { PaginatorModule } from "primeng/paginator";
import { DateAgoPipe } from 'src/app/pipe/date-ago.pipe';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  }
];

@NgModule({
  declarations: [
    ContentComponent,
    BuySpacePlansComponent,
    ProfileComponent,
    LandingPageComponent,
    ReferAndEarnComponent,
    RedeemCoinComponent,
    FaqComponent,
    EntertainmentComponent,
    OurProductComponent,
    BookingComponent,
    SearchComponent,
    MyPostsComponent,
    DateAgoPipe,
    NotificationsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    CommonModule,
    EventModule,
    OfflineShopsModule,
    CreateEventModule,
    CreateStreamModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    AccordionModule,
    ImageModule,
    TooltipModule,
    CKEditorModule,
    TranslateModule,
    SwiperModule,
    RatingModule,
    ProgressBarModule,
    DropdownModule,
    HelpModule,
    SharedModule,
    PickerModule,
    MatIconModule,
    QRCodeModule,
    InfiniteScrollModule,
    ZXingScannerModule,
    PaginatorModule
  ]
})
export class ContentModule {
}