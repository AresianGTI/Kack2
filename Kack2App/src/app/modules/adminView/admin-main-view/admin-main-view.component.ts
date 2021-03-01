import { variable } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
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



var ELEMENT_DATA: any[] = [
  // { Position: 1, Name: 'Krankenhaus Kirchheim', Einrichtungsart: "KS", Adresse: 'Ling' },
  // { Position: 2, Name: 'Psychatrie Kirchheim', Einrichtungsart: "HS", Adresse: 'Long' },
  // { Position: 3, Name: 'Huansohn', Einrichtungsart: "Karl_ess", Adresse: 'Taschang' },
];

@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss']
})
export class AdminMainViewComponent implements OnInit, OnDestroy {
  tab_selection!: string;
  displayedColumnsFacility: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  constructor(private router: Router,
    private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog) { }
  ngOnDestroy(): void {
    console.log("onDestroyCalled");
    this.subFacility.unsubscribe();
    this.subTrainee.unsubscribe();
  }
  
  dataSource = new MatTableDataSource<Facility>([]);  // Daten für die Einrichtungstabelle
  dataTrainee = new MatTableDataSource<Trainee>([]);  // Daten für die 1Azubitabelle

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent.tab.textLabel);

  }

  onBtnClick() {
    // this.sendData();
    console.log("Element-Data", ELEMENT_DATA);
  }
  sendData() {
    let item = {
      Position: 1,
      Name: 'Krankenhaus Kirchheim',
      Einrichtungsart: "KS",
      Adresse: 'Ling'
    }
    this.store.collection('facilityElements').add(item
    )
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      })
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
    console.log("Facility");
    this.refreshFacilities(this.subFacility, "facilityCollection", this.dataSource);
    console.log("Trainee");
    this.refreshTrainees(this.subTrainee,"traineeCollection", this.dataTrainee);
  }
  subFacility: any;
  subTrainee:any;
  refreshFacilities(sub: any, p_facilityElements: string, p_data: MatTableDataSource<any>) {
    this.subFacility = this.store.collection(p_facilityElements).valueChanges()

   .pipe()
    .subscribe(ss =>{
      let arr: any[] = [];
      let elemData: any[] = [];
      arr = ss;
      arr.forEach(element =>
        {
          elemData.push(element);
        })
      p_data.data = elemData;
      console.log("TestAusgabe fac", elemData);
    });

  }
  refreshTrainees(sub: any, p_facilityElements: string, p_data: MatTableDataSource<any>) {
    this.subTrainee = this.store.collection(p_facilityElements).valueChanges()

   .pipe()
    .subscribe(ss =>{
      let arr: any[] = [];
      let elemData: any[] = [];
      arr = ss;
      arr.forEach(element =>
        {
          elemData.push(element);
        })
      p_data.data = elemData;
      console.log("TestAusgabe train", elemData);
    });

  }
  // refresh() {
  
  //   if (!(this.changeDetectorRefs as any).destroyed) {
  //     this.changeDetectorRefs.detectChanges();
  // }
  // }
}
