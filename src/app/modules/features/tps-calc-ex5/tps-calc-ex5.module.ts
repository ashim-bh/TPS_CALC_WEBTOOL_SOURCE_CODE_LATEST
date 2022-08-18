import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TpsCalcEx5RoutingModule } from './tps-calc-ex5-routing.module';
import { Ex5SearchComponent } from './ex5-search/ex5-search.component';
import { Ex5HomeComponent } from './ex5-home/ex5-home.component';
import { Ex5CompressorComponent } from './ex5-compressor/ex5-compressor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { TpsPipeModule } from '@shared/pipes/tps-pipe/tps-pipe.module';
import { Ex5LoadFilesComponent } from './ex5-load-files/ex5-load-files.component';
import { Ex5LoginComponent } from './ex5-login/ex5-login.component';



@NgModule({
  declarations: [
    Ex5SearchComponent,
    Ex5HomeComponent,
    Ex5CompressorComponent,
    Ex5LoadFilesComponent,
    Ex5LoginComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    TpsCalcEx5RoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    TpsPipeModule,
  ]
})
export class TpsCalcEx5Module {
}
