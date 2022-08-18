import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './shared/loginpage/loginpage.component';
import { RegisterpageComponent } from './shared/registerpage/registerpage.component';
import { AuthGuardService } from '@core/services/auth-guard.service';


const routes: Routes = [
  { path: '', component: LoginpageComponent, pathMatch: 'full' },
  { path: 'calc55', loadChildren: () => import('./modules/features/tps-calc-55/tps-calc-55.module').then( m => m.TpsCalc55Module)},
{ path: 'ex5', loadChildren: () => import('./modules/features/tps-calc-ex5/tps-calc-ex5.module').then( m => m.TpsCalcEx5Module)},
{ path: 'login', component: LoginpageComponent, pathMatch: 'full' },
{ path: 'reg', component: RegisterpageComponent, pathMatch: 'full' }



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
