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
import { GoogleChartsModule } from 'angular-google-charts';


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
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { FacilityDialogComponent } from './modules/adminView/facility-dialog/facility-dialog.component'
import { TraineeDialogComponent } from './modules/adminView/trainee-dialog/trainee-dialog.component';
// import { Observable } from 'rxjs';
import { AuthService } from "./core/auth.service";
import { TraineeInformationComponent } from './modules/trainee-Info/trainee-information/trainee-information.component';
import { GoogleChartViewComponent } from './modules/coordinatorView/google-chart-view/google-chart-view.component';
import { FacilityChartComponent } from './modules/facility-chart/facility-chart.component';
import { TraineeChartComponent } from './modules/trainee-chart/trainee-chart.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DialogBoxComponent } from './modules/dialog-box/dialog-box.component';
import { GlobalstringsService } from './services/globalstrings/globalstrings.service';
import { FirestoreService } from './services/firestore/firestore.service';
// import { GlobalstringsService } from './services/globalstrings/globalstrings.service';
// import { FirestoreService } from './services/firestore/firestore.service';

import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarService } from './services/calendar/calendar.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    MainComponent,
    AdminMainViewComponent,
    FacilityDialogComponent,
    TraineeDialogComponent,
    TraineeInformationComponent,
    GoogleChartViewComponent,
    FacilityChartComponent,
    TraineeChartComponent,
    CalendarComponent,
    DialogBoxComponent,
    CalendarDialogComponent
    
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
   MatProgressBarModule,
   MatSlideToggleModule,
   MatSnackBarModule,
   MatSortModule, MatTableModule, MatTabsModule,
   MatIconModule,
   MatListModule,
   MatCheckboxModule,
   NgbModalModule,
   FlatpickrModule.forRoot(),
  //  Observable
  //  GoogleChartsModule
   CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
   MatDatepickerModule,
   MatNativeDateModule
  //  CalendarComponent,
  ],
  providers: [AuthService, GlobalstringsService, 
    FirestoreService, MatDatepickerModule,
    MatNativeDateModule, CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
