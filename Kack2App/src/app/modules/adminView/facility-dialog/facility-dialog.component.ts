import { ParseTreeResult, ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facility, IfacilityType } from 'src/app/models/facility';



@Component({
  selector: 'app-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility-dialog.component.scss']
})
export class FacilityDialogComponent implements OnInit {

  action: string;
  local_data: any;

  selectedValue: string = "";
  facilityObj: Facility = new Facility();
  selected = new FormControl(0);

  constructor(public firestore: AngularFirestore,

    public dialogRef: MatDialogRef<FacilityDialogComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if(typeof(data) === "string")
      {
        this.action = data;
      }
      else{
        console.log("Logger Lan", data);
        this.local_data = { ...data };
        this.action = this.local_data.action;
      }
   
  }

  facilityTypes: IfacilityType[] = [
    { typeName: "Krankenhaus" },
    { typeName: "Psychatrie" },
    { typeName: "Pflegeeinrichtung" },
    { typeName: "Altersheim" }
  ];

  ngOnInit(): void {
    //Beim Editieren von Einrichtungen werden die Felder mit den existierenden Werten Gefüllt.
    if(this.local_data)
    {
      this.facilityObj.name = this.local_data.Name;
      this.facilityObj.type.typeName = this.local_data.Einrichtungsart;
      this.facilityObj.capacity = this.local_data.Kapazitaet;
      this.facilityObj.adress = this.local_data.Adresse;
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getRightFunction(){
    if(this.action == "Update"){
      this.updateData()
      

    }
    else if(this.action == "Create"){
      this.createFacility();
    }

  }
  //FirestoreService
  updateData() {

    return this.firestore.collection("facilityCollection").doc(this.data.ID).update(
      {
        Name: this.facilityObj.name,
        Adresse: this.facilityObj.adress,
        Einrichtungsart: this.facilityObj.type.typeName,
        Kapazitaet: this.facilityObj.capacity
      }
    );
  }
  //FirestoreService
  createFacility() {
    this.facilityObj.id = this.firestore.createId();
    let facilityObj =
    {
      ID: this.facilityObj.id,
      Name: this.facilityObj.name,
      Adresse: this.facilityObj.adress,
      Einrichtungsart: this.facilityObj.type.typeName,
      Kapazitaet: this.facilityObj.capacity
    }
      ;

    this.firestore.collection('facilityCollection').doc(this.facilityObj.id).set(facilityObj).then(res => {
      this.facilityObj.name = "";
      this.facilityObj.adress = "";
      this.facilityObj.type.typeName = "";
      // this.facilityObj.capacity == undefined;  // funktioniert nicht
      console.log("test", res);
      alert("Die Einrichtung wurde erstellt!");
    }).catch(error => {
      console.log(error);
    });

  }


}