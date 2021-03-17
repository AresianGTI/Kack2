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
import { Facility } from 'src/app/models/facility';
import { element } from 'protractor';
import { Coordinators } from 'src/app/models/coordinators';
import { table } from 'console';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { DialogBoxComponent } from '../../../modules/dialog-box/dialog-box.component';

var ELEMENT_DATA: any[] = [];


export interface UsersData {
  name: string;
  id: number;
}

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
  // displayedColumns: string[] = ['id', 'name', 'action'];
  displayedColumnsFacility: string[] = ['Einrichtungsart','Name', 'action', ];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  displayedColumnsCoordinators: string[] = ['Nachname', 'Vorname', 'test'];
  isHidden = false;
  dataSourceTest: any[]=[];
  // @ViewChild(MatTable,{static:true}) table: MatTable<any>;
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
            this.dataSourceTest.push(element);
            console.log("datasource Test", this.dataSourceTest);
            p_data.data = ELEMENT_DATA;
          });
        }));
  }


  openDialog(action: any,obj: { action?: any; }) {
   
    let dialogRef: any;
    if(action == "Update")
    {
      obj.action = action;
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
      obj.action = action;
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
  updateRowData(row_obj: { id: any; name: any; }){
    ELEMENT_DATA= ELEMENT_DATA.filter((value: { id: any; name: any; },key: any)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
      }
      return true;
    });
  }
  deleteRowData(row_obj: { id: any; }){
    ELEMENT_DATA = ELEMENT_DATA.filter((value: { id: any; },key: any)=>{
      return value.id != row_obj.id;
    });
  }
  deleteData(data: any){
    console.log("DataSource Realtalk",this.dataSource);
    // this.refreshLists("")
    return this.store.collection("facilityCollection").doc(data.ID).delete();
  }

  
}
