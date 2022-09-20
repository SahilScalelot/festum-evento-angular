import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AddEditEventDialogComponent} from "../main/content/dialogs/add-edit-event-dialog/add-edit-event-dialog.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ValidNumberDirective} from "../directives/valid-number.directive";
import {ValidNumberWithDecimalDirective} from "../directives/valid-number-with-decimal.directive";

@NgModule({
  declarations: [
    AddEditEventDialogComponent,
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
    ProgressSpinnerModule,
    ValidNumberDirective,
    ValidNumberWithDecimalDirective,
  ]
})
export class SharedModule {
}
