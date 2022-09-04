import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {EventModule} from "./event/event.module";
import {CreateEventModule} from "./create-event/create-event.module";

const routes: Routes = [
  {
    path: '',
    component: ContentComponent
  }
];

@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    EventModule,
    CreateEventModule,
  ]
})
export class ContentModule {
}
