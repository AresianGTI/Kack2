import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AdminMainViewComponent } from './modules/adminView/admin-main-view/admin-main-view.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { MainComponent } from './main/main/main.component';
import { FacilityDialogComponent } from './modules/adminView/facility-dialog/facility-dialog.component'
import { TraineeDialogComponent } from './modules/adminView/trainee-dialog/trainee-dialog.component';

// Verstehe ich nicht richtig!!!!
// import { AuthGuard } from "./shared/guard/auth.guard";
import { TraineeInformationComponent } from './modules/trainee-Info/trainee-information/trainee-information.component';
import { GoogleChartViewComponent } from './modules/coordinatorView/google-chart-view/google-chart-view.component';
// import { CanReadGuard } from './core/can-read.guard';
import { AdminGuard } from './core/admin.guard';
import { CanReadGuard } from './core/can-read.guard';
import { SingleTraineeChartComponent } from './modules/coordinatorView/single-trainee-chart/single-trainee-chart/single-trainee-chart.component';
import { SingleFacilityChartComponent } from './modules/coordinatorView/single-facility-chart/single-facility-chart/single-facility-chart.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["loginView"]);
const dd = () => redirectUnauthorizedTo(["single-trainee"]);
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
    // An dieser Stelle funktioniert es
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'Stammdaten',
        // canActivate:[CanReadGuard],
        // data: { authGuardPipe: dd },
        component: AdminMainViewComponent,
      },
      {
        path: 'trainee',
        component: TraineeInformationComponent,
      },
      {
        path: 'GoogleCharts',
        component: GoogleChartViewComponent,
        canActivate: [AngularFireAuthGuard]
      },
      {
        path: 'Calendar',
        component: CalendarComponent,
        canActivate: [AngularFireAuthGuard]
      },
      {
        path: 'GoogleCharts/single-facility',
        component: SingleFacilityChartComponent,
        canActivate: [AngularFireAuthGuard],
        // data: { authGuardPipe: dd },
      },
      // data: { authGuardPipe: dd },
      {
        path: 'GoogleCharts/single-facility/single-trainee',
        component: SingleTraineeChartComponent,
        canActivate: [AngularFireAuthGuard],
      }
    ],
  },
  {
    path: 'loginView',
    component: LoginViewComponent
  },
  {
    path: 'facility-dialog', component: FacilityDialogComponent,
    // canActivate:[CanReadGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'trainee-dialog', component: TraineeDialogComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },

  { path: '**', redirectTo: "/loginView", pathMatch: "full" }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
