import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { HelpComponent } from './help.component';
import { HelpService } from './help.service';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule],
  declarations: [HelpComponent],
  providers: [HelpService],
})
export class HelpModule { }