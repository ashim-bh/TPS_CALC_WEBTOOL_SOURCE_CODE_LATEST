import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ex5HomeComponent } from './ex5-home/ex5-home.component';
import { Ex5SearchComponent } from './ex5-search/ex5-search.component';

const routes: Routes = [
  { path: '', component: Ex5SearchComponent, pathMatch: 'full' },
  { path: 'job/:id', component: Ex5HomeComponent, pathMatch: 'full' },
  { path: 'new', component: Ex5HomeComponent, pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpsCalcEx5RoutingModule { }
