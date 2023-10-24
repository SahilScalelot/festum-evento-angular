import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from "./event.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { EventOverviewComponent } from './event-overview/event-overview.component';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AgmCoreModule } from '@agm/core';
import { ImageModule } from 'primeng/image';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TranslateModule } from "@ngx-translate/core";
import { ProgressBarModule } from "primeng/progressbar";
import { MatExpansionModule } from '@angular/material/expansion';
import { TooltipModule } from 'primeng/tooltip';
import { ModalModule } from '../../_modal';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventChatComponent } from './event-chat/event-chat.component';

const routes: Routes = [
  {
    path: '', component: EventComponent
  },
  {
    path: ':id', component: EventOverviewComponent
  },
  {
    path: 'chat/:id', component: EventChatComponent
  }
];

@NgModule({
  declarations: [
    EventComponent,
    EventOverviewComponent,
    EventChatComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RatingModule,
    CheckboxModule,
    PaginatorModule,
    VirtualScrollerModule,
    ImageModule,
    PickerModule,
    ModalModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    TooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q',
      libraries: ['places']
    }),
    TranslateModule,
    ProgressBarModule
  ],
  providers: [DatePipe],
})
export class EventModule {
}
