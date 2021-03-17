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

import { AuthService } from 'src/app/core/auth.service';
import { DialogBoxComponent } from '../../../modules/dialog-box/dialog-box.component';



export interface UsersData {
  name: string;
  id: number;
}

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
  user: any;
  //for subscriptions and unsubscriptions
  subscriptions: Subscription[] = [];
  // displayedColumns: string[] = ['id', 'name', 'action'];
  displayedColumnsFacility: string[] = ['Einrichtungsart','Name', 'action', ];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  displayedColumnsCoordinators: string[] = ['Nachname', 'Vorname', 'test'];
  isHidden = false;
  dataSourceTest: any[]=[];
  // @ViewChild(MatTable,{static:true}) table: MatTable<any>;

facilityCollection = new MatTableDataSource<Facility>([]);  // Elemente für die Einrichtungstabelle
traineeCollection = new MatTableDataSource<Trainee>([]);  // Elemente für die Azubitabelle
CoordinatorCollection = new MatTableDataSource<Coordinators>([]);
 


  
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
    this.refreshList("facilityCollection", this.facilityCollection);
    this.refreshList("users", this.traineeCollection);
  }


  refreshList(p_facilityElements: string, collection: MatTableDataSource<any>) {
    let p_arr: any[] = [];
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();

    this.subscriptions.push(
      collectionInstance
        // .pipe(takeUntil(this.destroyed$))
        .subscribe(ss => {
          let ELEMENT_DATA: any[] = [];
          ss.forEach(element => {
            ELEMENT_DATA.push(element);
            collection.data = ELEMENT_DATA;
          });
        }));
  }


  openDialog(action: any,obj?: { action?: any; }) {
   
    let dialogRef: any;
    if(action == "Update")
    {
      obj!.action = action;
      switch (this.tab_selection) {
        case ("Einrichtung"): {
          dialogRef = this.dialog.open(FacilityDialogComponent, {data:obj});
          // dialogRef.afterClosed().subscribe((result: { event: string; data: any; }) => {this.updateData(result.data)}); //Einrichtungsdialog wird geöffnet
          break;
        }
        case ("Auszubildender"): {
          dialogRef = this.dialog.open(TraineeDialogComponent, {data:obj});
          dialogRef.afterClosed().subscribe((result: { event: string; data: any; }) => {});  //Azubidialog wird geöffnet
          break;
        }
        default: {
          break;
        }
      }
    }
    else if(action == "Create")
    {
      switch (this.tab_selection) {
        case ("Einrichtung"): {
          dialogRef = this.dialog.open(FacilityDialogComponent, {data: action});
          // dialogRef.afterClosed().subscribe((result: { event: string;}) => {}); //Einrichtungsdialog wird geöffnet
          break;
        }
        case ("Auszubildender"): {
          dialogRef = this.dialog.open(TraineeDialogComponent);
          // dialogRef.afterClosed().subscribe((result: { event: string; data: any; }) => {});  //Azubidialog wird geöffnet
          break;
        }
        default: {
          break;
        }
      }
    }
    else if(action == "Delete"){
      obj!.action = action;
      dialogRef = this.dialog.open(DialogBoxComponent, {data:obj});
      dialogRef.afterClosed().subscribe((result: { event: string; data: any; }) => {this.deleteData(result.data)});
    }
    else if(action == "")
    {

    }
  }
  updateData(data: any) {

    return this.store.collection("facilityCollection").doc(data.ID).update(
      {
        Kapzitaet: 10
      }
    );
  }
  // addRowData(row_obj: { name: any; }){
  //   var d = new Date();
  //   this.dataSource.push({
  //     id:d.getTime(),
  //     name:row_obj.name
  //   });
  //   this.table.renderRows();
  // }
  
  deleteData(data: any){
    console.log("DataSource Realtalk",this.facilityCollection);
    // this.refreshLists("")
    return this.store.collection("facilityCollection").doc(data.ID).delete();
  }


  DeleteChoice() {

    const facCollection = this.store.collection("facilityCollection")
      .get()
      .toPromise()
      .then(querySnapshot => {
        this.facilityCollection.data.length = 0;
        querySnapshot.forEach((doc) => this.store.collection("facilityCollection").doc(doc.id).delete())
        console.log("Es hat funktioniert");
      })
      .catch((error) => console.error("Error removing document: ", error)
      );

      facCollection.then(prom =>
        console.log("Refreshe die Seite hier, um den Fehler zu umgehen? DIESE FUNKTION IST NICHT FERTIG!")
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
