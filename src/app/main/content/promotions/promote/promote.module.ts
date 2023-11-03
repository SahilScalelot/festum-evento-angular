import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule, Routes } from '@angular/router';
import { PromoteComponent } from './promote.component';
// import { UserTypesComponent } from './user-types/user-types.component';
// import { UsersComponent } from './users/users.component';
// import { PublishDateAndTimeComponent } from './publish-date-and-time/publish-date-and-time.component';
// import { BillDetailsComponent } from './bill-details/bill-details.component';
import { StepsModule } from 'primeng/steps';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar";
import { ProgressSpinnerModule} from "primeng/progressspinner";

const routes: Routes = [
  {
    path: '',
    component: PromoteComponent
  },
  
];

@NgModule({
  declarations: [
    PromoteComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    StepsModule,
    ReactiveFormsModule,
    CalendarModule,
    ProgressSpinnerModule
  ]
})
export class PromoteModule { }
