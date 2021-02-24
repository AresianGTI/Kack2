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
import { TraineeDialogComponent } from '../trainee-dialog/trainee-dialog.component';
import { FormControl } from '@angular/forms';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';



var ELEMENT_DATA: PeriodicElement[] = [
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

  tab_selection!: string;


  displayedColumns: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];

  constructor(private router: Router,
    private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    ) { }

  dataSource = new MatTableDataSource<PeriodicElement>([]);
  t1: PeriodicElement = new PeriodicElement()
  onBtnClick() {
    this.sendData();
    console.log("Element-Data", ELEMENT_DATA);
  }
  sendData() {
    let item = {Position: 1,
      Name: 'Krankenhaus Kirchheim',
      Einrichtungsart: "KS",
      Adresse: 'Ling'}
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


  ngOnInit() {
    this.tab_selection = "Einrichtung";
    const collectionRef = this.store.collection('facilityElements');
    const collectionInstance = collectionRef.valueChanges();
    collectionInstance.subscribe(ss => {
      this.myArray = ss;
      console.log("myArray", this.myArray);
      ELEMENT_DATA = [];
      this.myArray.forEach(element => {
        
        ELEMENT_DATA.push(element);
        this.dataSource.data = ELEMENT_DATA;
      });
      this.refresh();

    });
  }
  refresh() {
    this.changeDetectorRefs.detectChanges();
  }
  onQuery(p_collection: AngularFirestoreCollection<unknown>) {
    p_collection
      // , ref => ref
      // .where("name", ">=", "")
      .get()
      .subscribe(ss => {
        ss.docs.forEach(doc => {
          console.log(doc.data());
          console.log(this.myArray);
        })
      }
      )
  }
}
