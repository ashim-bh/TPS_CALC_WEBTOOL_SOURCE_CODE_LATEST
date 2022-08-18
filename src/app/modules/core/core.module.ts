import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material/angular-material.module';

import { CoreRoutingModule } from './core-routing.module';


@NgModule({
  declarations: [
    
    
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AngularMaterialModule
  ]
})
export class CoreModule { }
