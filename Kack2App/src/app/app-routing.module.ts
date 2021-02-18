import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AdminMainViewComponent } from './_adminView/admin-main-view/admin-main-view.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, canActivate} from '@angular/fire/auth-guard';
import { MainComponent } from './main/main/main.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["loginView"])
const routes: Routes = [
  {path: 'loginView', component: LoginViewComponent},
  {path: 'adminMainView', component: AdminMainViewComponent},
  // , ...canActivate(redirectUnauthorizedToLogin)},
  {path: 'MainView', component: MainComponent, ...canActivate(redirectUnauthorizedToLogin)},
  
  
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
