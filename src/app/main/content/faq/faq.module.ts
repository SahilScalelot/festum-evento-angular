import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from '../help/help.component';
import { FaqComponent } from './faq.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':msg', component: FaqComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FaqModule { }
