import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PromoteComponent } from './promote.component';
import { UserTypesComponent } from './user-types/user-types.component';
import { UsersComponent } from './users/users.component';
import { PublishDateAndTimeComponent } from './publish-date-and-time/publish-date-and-time.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { StepsModule } from 'primeng/steps';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar";

const routes: Routes = [
  {
    path: '',
    component: PromoteComponent,
    children: [
      {
        path: 'user-type', component: UserTypesComponent
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'publish-date-and-time', component: PublishDateAndTimeComponent
      },
      {
        path: 'bill-details', component: BillDetailsComponent
      }
    ]
  },
  
];

@NgModule({
  declarations: [
    UserTypesComponent,
    UsersComponent,
    PublishDateAndTimeComponent,
    BillDetailsComponent,
    PromoteComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule,
    ReactiveFormsModule,
    CalendarModule,
  ]
})
export class PromoteModule { }
