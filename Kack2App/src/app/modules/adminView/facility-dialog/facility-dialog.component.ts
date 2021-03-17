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
  facilityX: Facility = new Facility();
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
    { facilitytypeName: "Krankenhaus" },
    { facilitytypeName: "Psychatrie" },
    { facilitytypeName: "Pflegeeinrichtung" },
    { facilitytypeName: "Altersheim" }
  ];

  ngOnInit(): void {
  }




  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  // cancel(): void {
  //   // this.data.task.title = this.backupTask.title;
  //   // this.data.task.description = this.backupTask.description;
  //   // this.dialogRef.close(this.data);
  //   // console.log("Test erfolgreich")
  // }
  getRightFunction(){
    if(this.action == "Update"){
      this.updateData()
      

    }
    else if(this.action == "Create"){
      this.createFacility();
    }

  }
  updateData() {

    return this.firestore.collection("facilityCollection").doc(this.data.ID).update(
      {
        Name: this.facilityX.facilityName,
        Adresse: this.facilityX.facilityadress,
        // Einrichtungsart: this.facilityX.facilitytype.facilitytypeName,
        Kapazitaet: this.facilityX.capacity
      }
    );
  }
  createFacility() {
    this.facilityX.id = this.firestore.createId();
    let facilityObj =
    {
      ID: this.facilityX.id,
      Name: this.facilityX.facilityName,
      Adresse: this.facilityX.facilityadress,
      Einrichtungsart: this.facilityX.facilitytype.facilitytypeName,
      Kapazitaet: this.facilityX.capacity
    }
      ;

    this.firestore.collection('facilityCollection').doc(this.facilityX.id).set(facilityObj).then(res => {
      this.facilityX.facilityName = "";
      this.facilityX.facilityadress = "";
      this.facilityX.facilitytype.facilitytypeName = "";
      // this.facilityX.capacity == undefined;  // funktioniert nicht
      console.log("test", res);
      alert("Die Einrichtung wurde erstellt!");
    }).catch(error => {
      console.log(error);
    });

  }


  changeFacility() {

    //   const userRef: AngularFirestoreDocument<any> = this.afs.doc<any>("users" + `/${user.uid}`);
    //   const userData: any = {
    //     uid: user.uid,
    //     email: user.email!,
    //     displayName: user.displayName!,
    //     emailVerified: user.emailVerified,
    //     roles: {
    //       trainee: data?.rolesobj.trainee ,
    //       admin: data?.rolesobj.admin ,
    //       coordinator: data?.rolesobj.coordinator
    //     },
    //     Stammeinrichtung: data?.home_facility.facilityName || "Keine Stammeinrichtung",
    //     Nachname: data?.name || "Name No Value",
    //     Vorname: data?.firstname || "FirstName No Value"
    //   }
    //   this.testData = userData;
    //   console.log("UserData", this.testData)
    //   // Updates existing Documents in a non-destructive way
    //   return userRef.set(userData, {
    //     merge: true
    //   })
    // }
  }
}