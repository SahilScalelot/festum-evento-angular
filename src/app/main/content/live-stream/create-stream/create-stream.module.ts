import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateStreamComponent } from './create-stream.component';
import { CreateComponent } from './create/create.component';
import { PhotosAndVideosComponent } from './photos-and-videos/photos-and-videos.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { StepsModule } from 'primeng/steps';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from "../../../../shared/shared.module";
import { ModalModule } from 'src/app/main/_modal';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    path: '',
    component: CreateStreamComponent,
    children: [
      {
        path: 'stream', component: CreateComponent
      },
      {
        path: 'photos-and-videos', component: PhotosAndVideosComponent
      },
      {
        path: 'company-details', component: CompanyDetailsComponent
      },
      {
        path: 'personal-details', component: PersonalDetailsComponent
      },
      {
        path: 'terms-and-condition', component: TermsAndConditionsComponent
      }
    ]
  },
  
];

@NgModule({
  declarations: [
    CreateStreamComponent,
    CreateComponent,
    PhotosAndVideosComponent,
    CompanyDetailsComponent,
    PersonalDetailsComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    StepsModule,
    ReactiveFormsModule,
    CalendarModule,
    CKEditorModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    SharedModule,
    ModalModule,
    DropdownModule,
  ]
})
export class CreateStreamModule { }
