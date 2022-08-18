import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TpsNumberFormatterPipe } from './tps-number-formatter.pipe';



@NgModule({
  declarations: [
    TpsNumberFormatterPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TpsNumberFormatterPipe
  ]
})
export class TpsPipeModule { }
