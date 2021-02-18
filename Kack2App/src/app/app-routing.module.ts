import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AdminMainViewComponent } from './_adminView/admin-main-view/admin-main-view.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, canActivate} from '@angular/fire/auth-guard';
import { MainComponent } from './main/main/main.component';
import { FacilityDialogComponent } from './_adminView/facility-dialog/facility-dialog.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["loginView"])
// const loggedIn = () => loggedIn(["login"]);
// const routes: Routes = [
//   {path: 'loginView', component: LoginViewComponent},
//   {path: 'adminMainView', component: AdminMainViewComponent},
//   {path: 'Main', component: MainComponent}
//   // , ...canActivate(redirectUnauthorizedToLogin)},
 
// ];

const routes: Routes = [
  {
    path: 'Main',
    component: MainComponent,
    canActivate:[AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
        {
            path: '',
            component: AdminMainViewComponent,
        },
    ],
  },
  {path: 'loginView', component: LoginViewComponent},
  {path: 'facility-dialog', component: FacilityDialogComponent},
  {path: '', redirectTo: "loginView", pathMatch: "full"}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
