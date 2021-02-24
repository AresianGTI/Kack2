import { variable } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../someservice.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';
import { Trainee } from 'src/app/models/trainee';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TraineeDialogComponent } from '../trainee-dialog/trainee-dialog.component';



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
export class AdminMainViewComponent implements OnInit {
  displayedColumnsFacility: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];
  displayedColumnsTrainee: string[] = ['Nachname', 'Vorname', 'Stammeinrichtung'];
  constructor(private router: Router,
    private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog) { }
  
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  dataTrainee = new MatTableDataSource<Trainee>([]);
  t1: PeriodicElement = new PeriodicElement()

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
  sendTraineeData() {
    //     let item =
    //      {Position: 1,
    //       Name: 'Holz ',
    //       Vorname: "Kopf aus",
    //       Stammeinrichtung: 'Ling-HS krankenhaus'}
    //     this.store.collection('traineeElements').add(item
    //  )
    //       .then(res => {
    //         console.log(res);
    //       })
    //       .catch(e => {
    //         console.log(e);
    //       })
    // this.onQuery(this.store.collection("facilityElements"));
  }
  openDialog() {
    const dialogRef = this.dialog.open(FacilityDialogComponent);
    //Einrichtungsdialog wird geöffnet
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
      this.refresh();
    });
  }
  refresh() {
    this.changeDetectorRefs.detectChanges();
  }
}
