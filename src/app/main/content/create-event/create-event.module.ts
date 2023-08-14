import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StepsModule } from "primeng/steps";
import { CreateEventComponent } from "./create-event.component";
import { AddEventStepComponent } from "./steps/add-event-step/add-event-step.component";
import { AboutEventStepComponent } from "./steps/about-event-step/about-event-step.component";
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from "../../../shared/shared.module";
import { ArrangementStepComponent } from './steps/arrangement-step/arrangement-step.component';
import { LocationStepComponent } from './steps/location-step/location-step.component';
import { PhotosVideosStepComponent } from './steps/photos-videos-step/photos-videos-step.component';
import { PermissionStepComponent } from './steps/permission-step/permission-step.component';
import { DiscountStepComponent } from './steps/discount-step/discount-step.component';
import { CompanyDetailsStepComponent } from './steps/company-details-step/company-details-step.component';
import { PersonalDetailsStepComponent } from './steps/personal-details-step/personal-details-step.component';
import { TermsAndConditionsStepComponent } from './steps/terms-and-conditions-step/terms-and-conditions-step.component';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { ArrangementDialogComponent } from './steps/arrangement-step/arrangement-dialog/arrangement-dialog.component';
import { ModalModule } from '../../_modal';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AgmCoreModule } from "@agm/core";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from "primeng/inputnumber";
import { CheckboxModule } from 'primeng/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropdownModule } from 'primeng/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ImageModule } from 'primeng/image';

const routes: Routes = [
  { path: '', redirectTo: 'add-event', pathMatch: 'full' },
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
    ImageCropperModule,
    ModalModule,
    CKEditorModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CheckboxModule,
    InputNumberModule,
    MatProgressSpinnerModule,
    NgxDropzoneModule,
    MatExpansionModule,
    DropdownModule,
    ImageModule,
    NgxIntlTelInputModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q',
      libraries: ['places']
    }),
  ]
})
export class CreateEventModule {
}
