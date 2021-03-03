import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AdminMainViewComponent } from './modules/adminView/admin-main-view/admin-main-view.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MainComponent } from './main/main/main.component';
import { FacilityDialogComponent } from './modules/adminView/facility-dialog/facility-dialog.component'
import { TraineeDialogComponent } from './modules/adminView/trainee-dialog/trainee-dialog.component';
import { GoogleChartViewComponent } from './modules/coordinatorView/google-chart-view/google-chart-view.component';
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
    path: '',
    component: MainComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'Stammdaten',
        component: AdminMainViewComponent,

      },
      {
        path: 'GoogleCharts',
        component: GoogleChartViewComponent,

      }
    ],
  },

  { path: 'loginView', component: LoginViewComponent },

  {
    path: 'facility-dialog', component: FacilityDialogComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },

  {
    path: 'trainee-dialog', component: TraineeDialogComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
