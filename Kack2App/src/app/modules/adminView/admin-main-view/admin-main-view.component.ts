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
import { Facility, IFacility, IfacilityType } from 'src/app/models/facility';
import { element } from 'protractor';
import { Coordinators } from 'src/app/models/coordinators';
import { table } from 'console';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {DataSource, SelectionModel} from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";


var ELEMENT_DATA: Array<any> = [];
var data: Array<any> = [];



@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
  //     state('expanded', style({ height: '*', visibility: 'visible' })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminMainViewComponent implements OnInit, OnDestroy {

expandedElement!: IFacility;




  tab_selection!: string;

  //for subscriptions and unsubscriptions
  subscriptions: Subscription[] = [];

  displayedColumnsFacility: string[] = ['Name', 'Einrichtungsart', 'Adresse'];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  displayedColumnsCoordinators: string[] = ['Nachname', 'Vorname', 'test'];
  isHidden = false;

facilityCollection!: Array<Facility>;  // Elemente für die Einrichtungstabelle
traineeCollection! : Array<Trainee>;  // Elemente für die Azubitabelle
CoordinatorCollection = new MatTableDataSource<Coordinators>([]);
 


  
  constructor(private router: Router,
    private store: AngularFirestore,
    public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log("ondestroy aufgerufen");
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }



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
    this.refreshFacility("facilityCollection", this.facilityCollection);
    this.refreshLists("users", this.traineeCollection, 'isUserList');
  }

  // public subCoordinators: any;
  // this.refreshCoordinators(this.subCoordinators,"users", this.dataCoordinators);
  // refreshCoordinators(sub: any, p_facilityElements: string, p_data: MatTableDataSource<any>) {
  //   this.subCoordinators = this.store.collection(p_facilityElements, ref => ref
  //     .where("roles.coordinator", "==", true)).valueChanges()


  refreshFacility(p_facilityElements: string, collection: Array<any>){
    
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

      this.subscriptions.push(
        collectionInstance
          // .pipe(takeUntil(this.destroyed$))
          .subscribe(ss => {
            collection = ss;
            console.log("myTestArray",collection);

            collection.forEach(element => {
  
              data.push(element);
              this.facilityCollection = data;
              facCollection = this.facilityCollection;
  
            });
            console.log('expandedElement: ', this.expandedElement);
          }));
  }

  showTest(){
    console.log('expandedElement: ' , this.expandedElement);
    console.log('facilityCollection: ' , this.facilityCollection);
    console.log('facCollection: ', facCollection);
  }

  refreshLists(p_facilityElements: string, collection: Array<any>, collectionCheck: String) {

    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

    //Entweder in dieser Form mit eventuell richtiger Syntax komplette Funktion zurückgeben
    // return ((coll: Array<any>) => {
    //   coll = ELEMENT_DATA;
    // });


      this.subscriptions.push(
        collectionInstance
          // .pipe(takeUntil(this.destroyed$))
          .subscribe(ss => {
            collection = ss;
            console.log("myTestArray",collection);

            collection.forEach(element => {
  
              ELEMENT_DATA.push(element);
  
              //provisorische Übergabe...
              if (collectionCheck === 'isFacilityList'){
                this.facilityCollection = ELEMENT_DATA;
                
              }
              else if(collectionCheck === 'isUserList')
              this.traineeCollection = ELEMENT_DATA;
  
              //wenn Promise funktioniert
              //facCollection = ELEMENT_DATA;
  
            });
          }));


      //oder mit promise zurückgeben
      // return collection;

      

  }

  

  DeleteChoice() {

    const facCollection = this.store.collection("facilityCollection")
      .get()
      .toPromise()
      .then(querySnapshot => {
        this.facilityCollection.length = 0;
        querySnapshot.forEach((doc) => this.store.collection("facilityCollection").doc(doc.id).delete())
        console.log("Es hat funktioniert");
      })
      .catch((error) => console.error("Error removing document: ", error)
      );

      facCollection.then(prom =>
        console.log("Refreshe die Seite hier, um den Fehler zu umgehen?")
      );

  }

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