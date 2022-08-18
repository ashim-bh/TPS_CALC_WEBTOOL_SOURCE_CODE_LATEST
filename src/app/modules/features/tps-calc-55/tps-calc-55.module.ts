import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { TpsPipeModule } from '@shared/pipes/tps-pipe/tps-pipe.module';

import { TpsCalc55RoutingModule } from './tps-calc-55-routing.module';
import { Calc55HomeComponent } from './calc55-home/calc55-home.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { Calc55SearchComponent } from './calc55-search/calc55-search.component';
import { Calc55CompressorComponent } from './calc55-compressor/calc55-compressor.component';
import { Cal55LoadFilesComponent } from './cal55-load-files/cal55-load-files.component';
import { Cal55LoginComponent } from './cal55-login/cal55-login.component';




@NgModule({
  declarations: [
    Calc55HomeComponent,
    Calc55SearchComponent,
    Calc55CompressorComponent,
    Cal55LoadFilesComponent,
    Cal55LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    TpsCalc55RoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    TpsPipeModule,

  ]
})
export class TpsCalc55Module { }
