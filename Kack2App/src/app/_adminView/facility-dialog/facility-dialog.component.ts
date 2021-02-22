import { ParseTreeResult, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facility, IfacilityType } from 'src/app/models/facility';

@Component({
  selector: 'app-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility-dialog.component.scss']
})
export class FacilityDialogComponent implements OnInit {

  facilityX: Facility = new Facility();
  ftypeString: string = "";


  constructor(public firestore: AngularFirestore) {



  }

  facilityTypes: IfacilityType[] = [
    { facilitytypeName: "Krankenhaus" },
    { facilitytypeName: "Psychatrie" },
    { facilitytypeName: "Pflegeeinrichtung" },
    { facilitytypeName: "Altersheim" }
  ];

  ngOnInit(): void {
  }

  // cancel(): void {
  //   // this.data.task.title = this.backupTask.title;
  //   // this.data.task.description = this.backupTask.description;
  //   // this.dialogRef.close(this.data);
  //   // console.log("Test erfolgreich")
  // }
  createFacility() {

    let fc =
      {Adresse: this.facilityX.facilityadress,
      Einrichtungsart: this.facilityX.facilitytype.facilitytypeName,
      Name: this.facilityX.facilityName}
    ;
    
    this.firestore.collection('facilityElementsOnur2').add(fc).then(res =>{
      this.facilityX.facilityName = "";
      this.facilityX.facilityadress = "";
      this.facilityX.facilitytype.facilitytypeName = "";
      console.log("test", res);
      alert("Die Einrichtung wurde erstellt!");
    }).catch(error =>{
      console.log(error);
    });
  }
}