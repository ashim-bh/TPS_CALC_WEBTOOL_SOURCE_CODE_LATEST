import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Calc55HomeComponent } from './calc55-home/calc55-home.component';
import { Calc55SearchComponent } from './calc55-search/calc55-search.component';

const routes: Routes = [
  { path: '', component: Calc55SearchComponent, pathMatch: 'full' },
  { path: 'job/:id', component: Calc55HomeComponent, pathMatch: 'full' },
  { path: 'new', component: Calc55HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpsCalc55RoutingModule { }
