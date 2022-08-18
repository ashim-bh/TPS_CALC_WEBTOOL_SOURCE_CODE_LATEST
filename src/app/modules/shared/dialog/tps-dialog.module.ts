import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../angular-material/angular-material.module';

import { TpsDialogComponent } from './components/tps-dialog.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    TpsDialogComponent,
    NotificationComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ],
  entryComponents: [TpsDialogComponent]
})
export class TpsDialogModule { }
