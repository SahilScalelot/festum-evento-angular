import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AddEditEventDialogComponent} from "../main/content/dialogs/add-edit-event-dialog/add-edit-event-dialog.component";

@NgModule({
  declarations: [
    AddEditEventDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddEditEventDialogComponent,
  ]
})
export class SharedModule {
}
