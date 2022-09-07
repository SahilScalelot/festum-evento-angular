import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {StepsModule} from "primeng/steps";
import {CreateEventComponent} from "./create-event.component";
import {AddEventStepComponent} from "./steps/add-event-step/add-event-step.component";
import {AboutEventStepComponent} from "./steps/about-event-step/about-event-step.component";
import {TooltipModule} from 'primeng/tooltip';
import {SharedModule} from "../../../shared/shared.module";
import {ArrangementStepComponent} from './steps/arrangement-step/arrangement-step.component';
import {LocationStepComponent} from './steps/location-step/location-step.component';
import {PhotosVideosStepComponent} from './steps/photos-videos-step/photos-videos-step.component';
import {PermissionStepComponent} from './steps/permission-step/permission-step.component';
import {DiscountStepComponent} from './steps/discount-step/discount-step.component';
import {CompanyDetailsStepComponent} from './steps/company-details-step/company-details-step.component';
import {PersonalDetailsStepComponent} from './steps/personal-details-step/personal-details-step.component';
import {TermsAndConditionsStepComponent} from './steps/terms-and-conditions-step/terms-and-conditions-step.component';
import {AccordionModule} from 'primeng/accordion';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArrangementDialogComponent } from './steps/arrangement-step/arrangement-dialog/arrangement-dialog.component';

const routes: Routes = [
  {path: '', redirectTo: 'add-event', pathMatch: 'full'},
  {
    path: '',
    component: CreateEventComponent,
    children: [
      {
        path: 'add-event', component: AddEventStepComponent
      },
      {
        path: 'about-event', component: AboutEventStepComponent
      },
      {
        path: 'arrangement', component: ArrangementStepComponent
      },
      {
        path: 'location', component: LocationStepComponent
      },
      {
        path: 'photos-and-videos', component: PhotosVideosStepComponent
      },
      {
        path: 'permission', component: PermissionStepComponent
      },
      {
        path: 'discount', component: DiscountStepComponent
      },
      {
        path: 'company-details', component: CompanyDetailsStepComponent
      },
      {
        path: 'personal-details', component: PersonalDetailsStepComponent
      },
      {
        path: 'terms-and-conditions', component: TermsAndConditionsStepComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CreateEventComponent,
    AddEventStepComponent,
    AboutEventStepComponent,
    ArrangementStepComponent,
    LocationStepComponent,
    PhotosVideosStepComponent,
    PermissionStepComponent,
    DiscountStepComponent,
    CompanyDetailsStepComponent,
    PersonalDetailsStepComponent,
    TermsAndConditionsStepComponent,
    ArrangementDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule,
    TooltipModule,
    SharedModule,
    AccordionModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateEventModule {
}
