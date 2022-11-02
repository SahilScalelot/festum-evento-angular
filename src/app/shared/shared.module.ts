import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddEditEventDialogComponent } from "../main/content/dialogs/add-edit-event-dialog/add-edit-event-dialog.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ValidNumberDirective } from "../directives/valid-number.directive";
import { ValidNumberWithDecimalDirective } from "../directives/valid-number-with-decimal.directive";
import { ImageAndVideoPreviewComponent } from '../main/content/dialogs/image-and-video-preview/image-and-video-preview.component';

@NgModule({
  declarations: [
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    ValidNumberDirective,
    ValidNumberWithDecimalDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    ProgressSpinnerModule,
    ValidNumberDirective,
    ValidNumberWithDecimalDirective,
  ]
})
export class SharedModule {
}
