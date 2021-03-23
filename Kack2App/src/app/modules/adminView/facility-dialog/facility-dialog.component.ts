import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facility, IfacilityType } from 'src/app/models/facility';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';



@Component({
  selector: 'app-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility-dialog.component.scss']
})
export class FacilityDialogComponent implements OnInit {

  action: string;
  local_data: any;

  facilityObj: Facility = new Facility();
  selectedFormControl = new FormControl(0);

  constructor(
    public firestoreService: FirestoreService,
    public collectionService: CollectionsService,
    public dialogRef: MatDialogRef<FacilityDialogComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    if (typeof (data) === "string") {
      this.action = data;
    }
    else {
      this.local_data = { ...data };
      this.action = this.local_data.action;
    }

  }

  //Mögliche Veränderung in der Zukunft... Klassen?
  facilityTypes: IfacilityType[] = [
    { typeName: "Krankenhaus" },
    { typeName: "Psychatrie" },
    { typeName: "Pflegeeinrichtung" },
    { typeName: "Altersheim" }
  ];

  ngOnInit(): void {
    //get the current fields for editing facilities
    if (this.local_data) {
      this.facilityObj.ID = this.local_data.ID;
      this.facilityObj.name = this.local_data.Name;
      this.facilityObj.type.typeName = this.local_data.Einrichtungsart;
      this.facilityObj.capacity = this.local_data.Kapazitaet;
      this.facilityObj.adress = this.local_data.Adresse;
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  chooseFunction() {
    if (this.action == "Update") {
      this.firestoreService.updateCollection(this.collectionService.facilityCollection, this.facilityObj)
    }
    else if (this.action == "Create") {
      this.facilityObj.ID = this.firestoreService.createID(this.facilityObj);
      this.firestoreService.createFacility(
        this.collectionService.facilityCollection,
        this.facilityObj, this.getObjectData());
      this.resetFacilityObject();
    }
  }
  resetFacilityObject() {
    this.facilityObj.name = "";
    this.facilityObj.adress = "";
    this.facilityObj.type.typeName = "";
    this.facilityObj.capacity = 1;
  }

  getObjectData() {
    let facilityObj =
    {
      ID: this.facilityObj.ID,
      Name: this.facilityObj.name,
      Adresse: this.facilityObj.adress,
      Einrichtungsart: this.facilityObj.type.typeName,
      Kapazitaet: this.facilityObj.capacity
    }
    return facilityObj;
  }
}