import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './event/event.component';
import { ContentComponent } from './content.component';
import { AuthGuard } from '../auth/auth-guard/auth.guard';
import { AddEventComponent } from './event/dialog/add-event/add-event.component';
import { CreateNewEventComponent } from './event/create-new-event/create-new-event.component';

const routes: Routes = [
  {
    path: "",
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "event", component: EventComponent },
      { path: "create-event", component: CreateNewEventComponent },
    ]
  }
];

@NgModule({
  declarations: [
    ContentComponent,
    EventComponent,
    AddEventComponent,
    CreateNewEventComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class ContentModule { }
