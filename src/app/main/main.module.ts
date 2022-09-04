import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { MainComponent } from './main.component';
import { ContentModule } from './content/content.module';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    ContentModule,
    SharedModule
  ]
})
export class MainModule { }
