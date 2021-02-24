import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { LoginViewComponent } from './login/login-view/login-view.component';
import { MainComponent } from './main/main/main.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdminMainViewComponent } from './modules/adminView/admin-main-view/admin-main-view.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select'; 
import { FacilityDialogComponent } from './modules/adminView/facility-dialog/facility-dialog.component'
import { TraineeDialogComponent } from './modules/adminView/trainee-dialog/trainee-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    MainComponent,
    AdminMainViewComponent,
    FacilityDialogComponent,
    TraineeDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSelectModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
   // CrudService muss bei providers rein
   AngularFireAuthModule,
   MatSliderModule,
   MatSidenavModule,
   MatTooltipModule,
   MatSlideToggleModule,MatSnackBarModule,
   MatSortModule, MatTableModule, MatTabsModule,
   MatIconModule,
   MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
