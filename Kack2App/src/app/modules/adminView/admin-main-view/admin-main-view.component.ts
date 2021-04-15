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
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AuthService } from 'src/app/core/auth.service';
import { DialogBoxComponent } from '../../../modules/dialog-box/dialog-box.component';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { EnumDialogBoxTypes, EnumRoles } from 'src/app/services/enums/enums.service';
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
  selectedTab!: string;
  dialogbox!: DialogBoxComponent;

  //for subscriptions and unsubscriptions
  subscriptions: Subscription[] = [];

  translatedColumnsFacility: string[] = ['Name', 'Einrichtungsart', 'Adresse', 'Kapazitaet'];
  ColumnsFacility = [
    { 'translated': 'Name', 'field': 'name' },
    { 'translated': 'Einrichtungsart', 'field': 'type' },
    { 'translated': 'Adresse', 'field': 'adress' },
    { 'translated': 'Kapazitaet', 'field': 'capacity' }
  ];

  translatedColumnsTrainee: string[] = ['Vorname', 'Name', 'Stammeinrichtung'];
  ColumnsTrainee = [
    { 'translated': 'Vorname', 'field': 'firstName' },
    { 'translated': 'Name', 'field': 'name' },
    { 'translated': 'Stammeinrichtung', 'field': 'homeFacility' },
  ];

  translatedColumnsCoordinator: string[] = ['Nachname', 'Vorname', 'test'];
  ColumnsCoordonator = [
    { 'translated': 'Vorname', 'field': 'firstName' },
    { 'translated': 'Name', 'field': 'name' },
    { 'translated': 'Stammeinrichtung', 'field': 'homeFacility' },
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
    public firestoreService: FirestoreService) {

  }

  ngOnDestroy(): void {
    this.subscriptionService.DestroySubscriptions(this.subscriptions);
  }

  setSelectedTab(tabChangeEvent: MatTabChangeEvent) {          // Hier wird der Label vom Tab in die Variable zugewiesen!!!
    this.selectedTab = tabChangeEvent.tab.textLabel;
    console.log("Aktueller Tab: ", this.selectedTab);
  }

  ngOnInit() {
    this.selectedTab = "Einrichtung";
    this.refreshFacilityList(CollectionsService.facilityCollection, this.facilityContent); // Die Reihenfolge der beiden Methoden verändert es ganz 
    this.refreshtTraineeList(CollectionsService.userCollection, this.traineeContent);      // merwürdig. Beim ersten Aufruf funktioniert es, wie es soll...
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
          console.log("MyArrayInFacility:", tableContent.data);
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
          console.log("MyArrayInTrainee:", tableContent.data);
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
    switch (this.selectedTab) {
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

  openDialog(action: any, obj?: { action?: any, dialogContent: string }) {
    if (action == "Update") {
      this.ChooseDialog(action, obj);
    }
    else if (action == "Create") {
      this.ChooseDialog(action);
    }
    else if (action == "Delete") {
      let dialogRef: any;
      obj!.action = action;
      obj!.dialogContent = EnumDialogBoxTypes.deletingRow;

      // this.dialogbox.dialogContent = EnumDialogBoxTypes.deleteAllFacilities;
      dialogRef = this.dialog.open(DialogBoxComponent, { data: obj });
      dialogRef.afterClosed()
        .subscribe((result: { event: string; data: any; }) => {
          if (this.selectedTab == 'Einrichtung')
            this.firestoreService.deleteDocument(
              result.data, CollectionsService.facilityCollection);
              //hier müssen wieder alle Azubis der expanded Einrichtung gelöscht werden
          if (this.selectedTab == 'Auszubildender')
            this.firestoreService.deleteDocument(
              result.data, CollectionsService.userCollection);
              //hier muss usedCapacity runtergezählt werden
        });
    }
  }

  openWarningDialog(action: string) {

    let dialogRef: any;
    let propertiesForDialog: {
      action: string,
      dialogContent: string,
      selectedTab: string
    } = { action: '', dialogContent: '', selectedTab: this.selectedTab };

    propertiesForDialog.dialogContent = EnumDialogBoxTypes.deleteAllFacilities;
    propertiesForDialog.action = action;
    dialogRef = this.dialog.open(DialogBoxComponent, { data: propertiesForDialog });
    
  }

  deleteAll() {
    switch (this.selectedTab) {
      case 'Einrichtung': {
        this.firestoreService.deleteAllFacilities(CollectionsService.facilityCollection, CollectionsService.userCollection);
        // this.facilityContent = undefined; // muss anders geleert werden
        break;
      }
      case 'Auszubildender': {
        this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.trainee);
        break;
      }
      case 'Koordinatoren': {
        // this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.coordinator);
        break;
      }
      case 'Traeger': {
        // this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.teacher);
        break;
      }
      default: {
        alert('Something went wrong. :/ ');
        break;
      }
    }
  }
  
}