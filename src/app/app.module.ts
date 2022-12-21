import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalFunctions } from './main/common/global-functions';
import { MainModule } from './main/main.module';
import { GlobalService } from './services/global.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Time24to12Format } from './main/common/time24to12.pipe';

@NgModule({
  declarations: [
    AppComponent,
    Time24to12Format
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    SnotifyModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    GlobalFunctions,
    GlobalService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ],
  exports: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
