import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { AdminMainViewComponent } from './modules/adminView/admin-main-view/admin-main-view.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, canActivate} from '@angular/fire/auth-guard';
import { MainComponent } from './main/main/main.component';
import { FacilityDialogComponent } from './modules/adminView/facility-dialog/facility-dialog.component'
import { TraineeDialogComponent } from './modules/adminView/trainee-dialog/trainee-dialog.component';

// Verstehe ich nicht richtig!!!!
// import { AuthGuard } from "./shared/guard/auth.guard";
import { TraineeInformationComponent } from './modules/trainee-Info/trainee-information/trainee-information.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["loginView"])

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate:[AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
        {
            path: 'Stammdaten',
            component: AdminMainViewComponent,  
        },
        {
          path: 'trainee',
          component: TraineeInformationComponent,  
      }
    ],
  },
  {path: 'loginView', component: LoginViewComponent},
  {path: 'facility-dialog', component: FacilityDialogComponent,
  canActivate:[AngularFireAuthGuard],
  data: { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: 'trainee-dialog', component: TraineeDialogComponent,
  canActivate:[AngularFireAuthGuard],
  data: { authGuardPipe: redirectUnauthorizedToLogin }},
  // {path: '', redirectTo: "loginView", pathMatch: "full"}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
