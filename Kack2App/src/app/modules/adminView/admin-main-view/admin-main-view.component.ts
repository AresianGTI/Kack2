import { variable } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { Trainee } from 'src/app/models/trainee';
import { MatTabChangeEvent, MatTabLabel } from '@angular/material/tabs';
import { TraineeDialogComponent } from '../trainee-dialog/trainee-dialog.component';
import { FormControl } from '@angular/forms';
import { Facility, IFacility, IfacilityType } from 'src/app/models/facility';
import { element } from 'protractor';
import { Coordinators } from 'src/app/models/coordinators';
import { table } from 'console';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

import { AuthService } from 'src/app/core/auth.service';
import { DialogBoxComponent } from '../../../modules/dialog-box/dialog-box.component';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { EnumRoles } from 'src/app/services/enums/enums.service';
import { th } from 'date-fns/locale';
import { Collection } from 'typescript';





@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminMainViewComponent implements OnInit, OnDestroy {

  expandedElement!: IFacility;

  tab_selection!: string;

  //for subscriptions and unsubscriptions
  subscriptions: Subscription[] = [];
  displayedColumnsFacility: string[] = ['Einrichtungsart', 'Name', 'Kapazitaet'];


  displayedColumnsTrainee: string[] = ['name', 'firstName', 'homeFacility'];

  displayedColumnsCoordinators: string[] = ['Nachname', 'Vorname', 'test'];
  buttonIsHidden = false;
  dataSourceTest: any[] = [];

  facilityCollection = new MatTableDataSource<Facility>([]);  // Elemente für die Einrichtungstabelle
  traineeCollection = new MatTableDataSource<Trainee>([]);  // Elemente für die Azubitabelle
  CoordinatorCollection = new MatTableDataSource<Coordinators>([]);

  constructor(
    private store: AngularFirestore,
    public dialog: MatDialog,
    public authService: AuthService,
    public subscriptionService: SubscriptionCollectionService,
    public firestoreService: FirestoreService) {
  }

  ngOnDestroy(): void {

    // this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptionService.DestroySubscriptions(this.subscriptions);

  }

  setTab(tabChangeEvent: MatTabChangeEvent) {          // Hier wird der Label vom Tab in die Variable zugewiesen!!!
    this.tab_selection = tabChangeEvent.tab.textLabel;
    if (this.tab_selection == "Koordinatoren") this.buttonIsHidden = true
    else this.buttonIsHidden = false;
  }

  ngOnInit() {
    this.tab_selection = "Einrichtung";
    this.refreshList1("facilities", this.facilityCollection);
    this.refreshList("usersCollection", this.traineeCollection);
  }

  refreshList1(p_facilityElements: string, collection: MatTableDataSource<any>) {
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        .subscribe(ss => {
          let ELEMENT_DATA: any[] = [];
          ss.forEach(element => {
            ELEMENT_DATA.push(element);
            collection.data = ELEMENT_DATA;

          });
          console.log("MyArray:", collection.data);
        }));
  }
  refreshList(p_facilityElements: string, collection: MatTableDataSource<any>) {
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        .subscribe(ss => {
          let ELEMENT_DATA: any[] = [];
          ss.forEach(element => {
            ELEMENT_DATA.push(element);
            collection.data = ELEMENT_DATA;

          });
          console.log("MyArray2:", collection.data);
        }));
  }
  ChooseDialog(action: any, obj?: { action?: any; }) {
    let dialogRef: any;
    let data;
    if (obj!) {
      obj!.action = action;
      data = obj;
    }
    else {
      data = action;
    }
    switch (this.tab_selection) {
      case ("Einrichtung"): {
        dialogRef = this.dialog.open(FacilityDialogComponent, { data: data });
        break;
      }
      case ("Auszubildender"): {
        dialogRef = this.dialog.open(TraineeDialogComponent, { data: data });
        break;
      }
      default: {
        break;
      }
    }
  }

  openDialog(action: any, obj?: { action?: any; }) {
    if (action == "Update") {
      this.ChooseDialog(action, obj);
    }
    else if (action == "Create") {
      this.ChooseDialog(action);
    }
    else if (action == "Delete") {
      let dialogRef: any;
      obj!.action = action;
      dialogRef = this.dialog.open(DialogBoxComponent, { data: obj });
      dialogRef.afterClosed()
        .subscribe((result: { event: string; data: any; }) => {
          this.firestoreService.deleteDocument(
            result.data, "facilities")
        });
    }
  }

  /**
   * get the active Tab to return the right Collection.
   * @returns currentCollection : string
   */
  deleteAll() {
    if (this.tab_selection == "Einrichtung") {
      this.firestoreService.deleteAllDocuments(this.facilityCollection, "facilities");
      this.facilityCollection = new MatTableDataSource<Facility>([]);
    }
    if (this.tab_selection == "Auszubildender") {
      this.firestoreService.deleteAllDocuments(this.traineeCollection, "usersCollection");
      this.traineeCollection = new MatTableDataSource<Trainee>([]);
    }

  }
  // }

  // -------- Methoden für Checkboxen in der Tabelle -----------

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.facilityCollection.length;
  //   return numSelected === numRows;
  // }

  //Selektiert alles, wenn nicht alle ausgewählt sind, andernfalls alles entwählen
  // masterToggle() {
  //   this.isAllSelected() ?
  //       //if true
  //       this.selection.clear() :  
  //       //if false
  //       this.facilityCollection.data.forEach(fac => this.selection.select()); //fac
  // }

  //Das Label für die cCheckbox in der übergebenen Zeile ???
  // checkboxLabel(row?: IFacility): string {
  //   return "yoho";
  //  }

}
