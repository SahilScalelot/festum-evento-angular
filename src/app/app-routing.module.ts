import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./main/auth/auth-guard/auth.guard";
import {ContentComponent} from "./main/content/content.component";

const routes: Routes = [

  { path: '', redirectTo: 'event', pathMatch: 'full' },
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
        path: 'create-event',
        loadChildren: () => import('../app/main/content/create-event/create-event.module').then(m => m.CreateEventModule)
      }
    ]
  },
  // { path: '**', redirectTo: '/event' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
