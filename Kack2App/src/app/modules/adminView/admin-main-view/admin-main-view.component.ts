import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { IUser, Trainee } from 'src/app/models/user';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TraineeDialogComponent } from '../trainee-dialog/trainee-dialog.component';
import { Facility, IFacility, IfacilityType } from 'src/app/models/facility';
import { Coordinator } from 'src/app/models/user';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {  animate,  state,  style, transition,  trigger} from "@angular/animations";
import { AuthService } from 'src/app/core/auth.service';
import { DialogBoxComponent } from '../../../modules/dialog-box/dialog-box.component';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CollectionsService } from 'src/app/services/collections/collections.service';
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

  expandedFacility!: IFacility;
  expandedTrainee!: IUser;
  tab_selection!: string;
  
  //for subscriptions and unsubscriptions
  subscriptions: Subscription[] = [];

  translatedColumnsFacility: string[] = [ 'Name', 'Einrichtungsart', 'Adresse', 'Kapazitaet'];
  ColumnsFacility = [ 
    {'translated': 'Name', 'field' : 'name'},
    {'translated': 'Einrichtungsart', 'field' : 'type'},
    {'translated': 'Adresse', 'field' : 'adress'},
    {'translated': 'Kapazitaet', 'field' : 'capacity'}
    ];

  translatedColumnsTrainee: string[] = ['Vorname', 'Name', 'Stammeinrichtung'];
  ColumnsTrainee = [
    {'translated': 'Vorname', 'field' : 'firstName'},
    {'translated': 'Name', 'field' : 'name'},
    {'translated': 'Stammeinrichtung', 'field' : 'homeFacility'},
  ];

  translatedColumnsCoordinator: string[] = ['Nachname', 'Vorname', 'test'];
  ColumnsCoordonator = [
    {'translated': 'Vorname', 'field' : 'firstName'},
    {'translated': 'Name', 'field' : 'name'},
    {'translated': 'Stammeinrichtung', 'field' : 'homeFacility'},
  ];

  buttonIsHidden = false;

  facilityContent = new MatTableDataSource<Facility>([]);  // Elemente für die Einrichtungstabelle
  traineeContent = new MatTableDataSource<Trainee>([]);  // Elemente für die Azubitabelle
  CoordinatorCollection = new MatTableDataSource<Coordinator>([]);

  constructor(
    private store: AngularFirestore,
    public dialog: MatDialog,
    public authService: AuthService,
    public subscriptionService: SubscriptionCollectionService,
    public firestoreService: FirestoreService,
    private collectionService: CollectionsService) {
  }

  ngOnDestroy(): void {
    this.subscriptionService.DestroySubscriptions(this.subscriptions);
  }

  setTab(tabChangeEvent: MatTabChangeEvent) {          // Hier wird der Label vom Tab in die Variable zugewiesen!!!
    this.tab_selection = tabChangeEvent.tab.textLabel;
    if (this.tab_selection == "Koordinatoren") this.buttonIsHidden = true
    else this.buttonIsHidden = false;
  }

  ngOnInit() {
    this.tab_selection = "Einrichtung";
    this.refreshFacilityList(this.collectionService.facilityCollection, this.facilityContent); // Die Reihenfolge der beiden Methoden verändert es ganz 
    this.refreshtTraineeList(this.collectionService.userCollection, this.traineeContent);      // merwürdig. Beim ersten Aufruf funktioniert es, wie es soll...
  }

  refreshFacilityList(collection: string, tableContent: MatTableDataSource<any>) {
    const collectionRef = this.store.collection(collection);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        .subscribe(ss => {
          let ELEMENT_DATA: any[] = [];
          ss.forEach(element => {
            ELEMENT_DATA.push(element);
            tableContent.data = ELEMENT_DATA;
          });
          // this.subscriptionService.DestroySubscriptions(this.subscriptions);
          console.log("MyArrayInFacility:",  tableContent.data);
        }));
  }
  refreshtTraineeList(collection: string, tableContent: MatTableDataSource<any>) {
    const collectionRef = this.store.collection(collection);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        .subscribe(ss => {
          let ELEMENT_DATA: any[] = [];
          ss.forEach(element => {
            ELEMENT_DATA.push(element);
            tableContent.data = ELEMENT_DATA;
          });
          // this.subscriptionService.DestroySubscriptions(this.subscriptions);
          console.log("MyArrayInTrainee:",  tableContent.data);
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
      .subscribe((result: { event: string; data: any; }) =>
       { this.firestoreService.deleteDocument(
         result.data, this.collectionService.facilityCollection) });
    }
  }

  /**
   * get the active Tab to return the right Collection.
   * @returns currentCollection : string
   */
  getActiveTab(){
    let currentCollection: string = "";
    if(this.tab_selection == "Einrichtung") {
    currentCollection = this.collectionService.facilityCollection;
    }
    if(this.tab_selection == "Auszubildender"){
      currentCollection = this.collectionService.userCollection;
    }
    return currentCollection;

  }
  deleteAll(){
    this.firestoreService.deleteAllDocuments(this.facilityContent,this.getActiveTab());
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