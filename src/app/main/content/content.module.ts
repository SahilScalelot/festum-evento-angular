import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {AuthGuard} from '../auth/auth-guard/auth.guard';
import {EventModule} from "./event/event.module";
import {CreateNewEventModule} from "./create-new-event/create-new-event.module";

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'event',
        loadChildren: () => import('../content/event/event.module').then(m => m.EventModule)
      },
      {
        path: 'create-event',
        loadChildren: () => import('../content/create-new-event/create-new-event.module').then(m => m.CreateNewEventModule)
      },
    ]
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
    CreateNewEventModule,
  ]
})
export class ContentModule {
}
