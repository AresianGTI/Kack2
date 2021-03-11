import { variable } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { Trainee } from 'src/app/models/trainee';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TraineeDialogComponent } from '../trainee-dialog/trainee-dialog.component';
import { FormControl } from '@angular/forms';
import { Facility } from 'src/app/models/facility';
import { element } from 'protractor';
import { Coordinators } from 'src/app/models/coordinators';
import { table } from 'console';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';


var ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss']
})
export class AdminMainViewComponent implements OnInit, OnDestroy {
  tab_selection!: string;
  user: any;
  //for subscriptions and unsubscriptions
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  subscriptions: Subscription[] = [];

  displayedColumnsFacility: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  displayedColumnsCoordinators: string[] = ['Nachname', 'Vorname', 'test'];
  isHidden = false;
  constructor(private router: Router,
    private store: AngularFirestore,
    public dialog: MatDialog,
    public authService: AuthService) {
      // this.authService.user$.subscribe(user => this.user = user)
     }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log("ondestroy aufgerufen");
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }

  dataSource = new MatTableDataSource<Facility>([]);  // Daten für die Einrichtungstabelle
  dataTrainee = new MatTableDataSource<Trainee>([]);  // Daten für die Azubitabelle
  dataCoordinators = new MatTableDataSource<Coordinators>([]);

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent.tab.textLabel);
   
  }

  setTab(tabChangeEvent: MatTabChangeEvent) {          // Hier wird der Label vom Tab in die Variable zugewiesen!!!
    this.tab_selection = tabChangeEvent.tab.textLabel;
     if(this.tab_selection =="Koordinatoren") this.isHidden = true
     else this.isHidden = false;

  }

  ChooseDialog() {

    let dialogRef;
    switch (this.tab_selection) {
      case ("Einrichtung"): {
        dialogRef = this.dialog.open(FacilityDialogComponent);  //Einrichtungsdialog wird geöffnet
        break;
      }
      case ("Auszubildender"): {
        dialogRef = this.dialog.open(TraineeDialogComponent);  //Azubidialog wird geöffnet
        break;
      }
      default: {
        break;
      }
    }

  }

  ngOnInit() {
    this.tab_selection = "Einrichtung";
    this.refreshLists("users", this.dataTrainee);
    this.refreshLists("facilityCollection", this.dataSource);

  }

  // public subCoordinators: any;
  // this.refreshCoordinators(this.subCoordinators,"users", this.dataCoordinators);
  // refreshCoordinators(sub: any, p_facilityElements: string, p_data: MatTableDataSource<any>) {
  //   this.subCoordinators = this.store.collection(p_facilityElements, ref => ref
  //     .where("roles.coordinator", "==", true)).valueChanges()

  refreshLists(p_facilityElements: string, p_data: MatTableDataSource<any>) {
    let p_arr: any[] = [];
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        // .pipe(takeUntil(this.destroyed$))
        .subscribe(ss => {
          p_arr = ss;
          console.log("myArray", p_arr);
          ELEMENT_DATA = [];
          p_arr.forEach(element => {

            ELEMENT_DATA.push(element);
            p_data.data = ELEMENT_DATA;
          });
        }));

  }
}
