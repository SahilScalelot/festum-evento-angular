import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from "./event.component";
import {AuthGuard} from "../../auth/auth-guard/auth.guard";

const routes: Routes = [
  {
    path: '', component: EventComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    EventComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class EventModule {
}
