import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddEditEventDialogComponent } from "../main/content/dialogs/add-edit-event-dialog/add-edit-event-dialog.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ValidNumberDirective } from "../directives/valid-number.directive";
import { ValidNumberWithDecimalDirective } from "../directives/valid-number-with-decimal.directive";
import { ImageAndVideoPreviewComponent } from '../main/content/dialogs/image-and-video-preview/image-and-video-preview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidAlphabetDirective } from '../directives/valid-alphabet.directive';
import { TermsAndConditionsComponent } from '../main/common/terms-and-conditions/terms-and-conditions.component';
import { TooltipModule } from 'primeng/tooltip';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PrivacyPolicyComponent } from '../main/common/privacy-policy/privacy-policy.component';


@NgModule({
  declarations: [
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    ValidNumberDirective,
    ValidAlphabetDirective,
    ValidNumberWithDecimalDirective,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
    TooltipModule,
    MatTooltipModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    ProgressSpinnerModule,
    ValidNumberDirective,
    ValidAlphabetDirective,
    ValidNumberWithDecimalDirective,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent
  ]
})
export class SharedModule {
}
