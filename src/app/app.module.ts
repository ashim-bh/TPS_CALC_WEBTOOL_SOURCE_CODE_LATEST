import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//Vendor Modules
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TpsDialogModule } from './modules/shared/dialog/tps-dialog.module';
import { TpsPipeModule } from '@shared/pipes/tps-pipe/tps-pipe.module';
import { HelpComponent } from './shared/help/help.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RegisterpageComponent } from './shared/registerpage/registerpage.component';
import { LoginpageComponent } from './shared/loginpage/loginpage.component';
import { MatCard } from '@angular/material/card';
import {MatCardModule} from '@angular/material/card';
import { LoadingComponent } from './loading';
import { AuthenticationService } from '@core/services/authentication.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HelpComponent,
    RegisterpageComponent,
    LoginpageComponent,
    LoadingComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TpsDialogModule,
    TpsPipeModule,
    MatSnackBarModule,
    MatCardModule
    
  ],  
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
