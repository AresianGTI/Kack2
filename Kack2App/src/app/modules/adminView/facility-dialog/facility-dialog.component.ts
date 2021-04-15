import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facility, IfacilityType } from 'src/app/models/facility';
import { IFacilityFirebaseStructure } from 'src/app/models/firestoreModels';
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
    public fireStoreService: FirestoreService,
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
      this.facilityObj.name = this.local_data.name;
      this.facilityObj.type.typeName = this.local_data.type;
      this.facilityObj.capacity = this.local_data.capacity;
      this.facilityObj.adress = this.local_data.adress;
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  chooseFunction() {
    if (this.action == "Update") {
      this.fireStoreService.updateFacilityCollection(CollectionsService.facilityCollection, this.facilityObj)
    }
    else if (this.action == "Create") {
      
      this.fireStoreService.createDocument(CollectionsService.facilityCollection, this.getFacilityStructure());
      this.emptyFacilityObject();
    }
  }

  emptyFacilityObject() {
    this.facilityObj.name = "";
    this.facilityObj.adress = "";
    this.facilityObj.type.typeName = "";
    this.facilityObj.capacity = 1;
  }

  /**
   * Get the structure for documents in the facilityCollection
   * @returns facilityObj
   */
  getFacilityStructure() {
    this.facilityObj.ID = this.fireStoreService.createID(this.facilityObj);
    let facilityStructureObj: IFacilityFirebaseStructure = {
      ID: this.facilityObj.ID,
      name: this.facilityObj.name,
      capacity: this.facilityObj.capacity,
      usedCapacity: 0,
      adress: this.facilityObj.adress,
      type: this.facilityObj.type.typeName
    }
    return facilityStructureObj;
  }
}