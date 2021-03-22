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
import { TraineeChartComponent } from './modules/trainee-chart/trainee-chart.component';
import { FacilityChartComponent } from './modules/facility-chart/facility-chart.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { DialogBoxComponent } from './modules/dialog-box/dialog-box.component';
import { GlobalstringsService } from './services/globalstrings/globalstrings.service';

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
    // canActivate: [AngularFireAuthGuard],
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
        path: 'overview',
        component: TraineeInformationComponent,
      },
      {
        path: 'GoogleCharts',
        component: GoogleChartViewComponent,
        // canActivate: [AngularFireAuthGuard]
      },
      {
        path: 'Calendar',
        component: CalendarComponent,
        // canActivate: [AngularFireAuthGuard]
      },
      {
        path: 'GoogleCharts/facility-chart',
        component: FacilityChartComponent,
        // canActivate: [AngularFireAuthGuard],
        // data: { authGuardPipe: dd },
      },
      // data: { authGuardPipe: dd },
      {
        path: 'GoogleCharts/facility-chart/trainee-chart',
        component: TraineeChartComponent,
        // canActivate: [AngularFireAuthGuard],
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
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'trainee-dialog', component: TraineeDialogComponent,
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'dialog', component: DialogBoxComponent,
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },

  // { path: '**', redirectTo: "/loginView", pathMatch: "full" }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(public stringService: GlobalstringsService) {}
 }
