import { variable } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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



var ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss']
})
export class AdminMainViewComponent implements OnInit {
  tab_selection!: string;
  displayedColumnsFacility: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  constructor(private router: Router,
    private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog) { }
  
  dataSource = new MatTableDataSource<Facility>([]);  // Daten für die Einrichtungstabelle
  dataTrainee = new MatTableDataSource<Trainee>([]);  // Daten für die 1Azubitabelle

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent.tab.textLabel);

  }

  onBtnClick() {
    // this.sendData();
    console.log("Element-Data", ELEMENT_DATA);
  }

  myArray: any[] = []

  setTab(tabChangeEvent: MatTabChangeEvent ){          // Hier wird der Label vom Tab in die Variable zugewiesen!!!
    this.tab_selection = tabChangeEvent.tab.textLabel;
  }

  ChooseDialog() {

    let dialogRef;
    switch(this.tab_selection){
      case ("Einrichtung"): {
        dialogRef = this.dialog.open(FacilityDialogComponent);  //Einrichtungsdialog wird geöffnet
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      }
      case ("Auszubildender"):{
        dialogRef = this.dialog.open(TraineeDialogComponent);  //Azubidialog wird geöffnet
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      }
      default:{
        break;
      }
    }

  }
//aktuell ohne Funktion. Soll bei Choose Dialog ausgeführt werden
  openDialog(dialogRef: any, tab: string){

    // dialogRef = this.dialog.open(FacilityDialogComponent);  //Einrichtungsdialog wird geöffnet
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log(`Dialog result: ${result}`);
    //     });
  }
  openDialogTrainee() {
    const dialogRef = this.dialog.open(TraineeDialogComponent);
    //Einrichtungsdialog wird geöffnet
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    console.log("your are in Tab", this.tabChanged)
  }
  ngOnInit() {
    this.tab_selection = "Einrichtung";
    this.refreshLists("facilityCollection", this.dataSource);
    this.refreshLists("traineeCollection", this.dataTrainee);
  }
  refreshLists(p_facilityElements: string, p_data: MatTableDataSource<any>) {
    let p_arr: any[] = [];
    const collectionRef = this.store.collection(p_facilityElements);
    const collectionInstance = collectionRef.valueChanges();
    collectionInstance.subscribe(ss => {
      p_arr = ss;
      console.log("myArray", p_arr);
      ELEMENT_DATA = [];
      p_arr.forEach(element => {

        ELEMENT_DATA.push(element);
        p_data.data = ELEMENT_DATA;
      });
    });
  }

}
