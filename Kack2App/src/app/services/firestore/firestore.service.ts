import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Facility, IFacility } from 'src/app/models/facility';
import { IFacilityFirebaseStructure } from 'src/app/models/firestoreModels';
import { CollectionsService } from '../collections/collections.service';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public afs: AngularFirestore,
    public collectionService: CollectionsService) {
  }

  getAllFacilities(collection: string){
    return this.afs.collection(collection);
  }

  getFieldsFromCollection(collection: string, field: string):Array<any> {
    let fieldList: Array<{}> = [];
    this.afs.collection(collection)
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => { 
          fieldList.push(doc.get(field));
        })
      })
      return fieldList;
  }

  getUserData = (user: any, subscriptionList: Subscription[]): Promise<any> => {
    var docRef = this.afs.collection(this.collectionService.userCollection).doc(`/${user.uid}`);
    return docRef.ref.get().then((doc) => {
      return doc.data();
    })
  }

// Setting up user and facilities
 createDocument(collection: string, objData: any) {
  this.afs.collection(collection).doc(objData.ID).set(objData).then(res => {
  }).catch(error => {
    console.log(error);
  });
}
  deleteDocument(data: any, collec: string) {
    return this.afs.collection(collec).doc(data.ID).delete();
  }

  deleteAllDocuments(collection: any, collectionName: string) {
    this.afs.collection(collectionName)
      .get()
      .toPromise()
      .then(querySnapshot => {
        collection.data.length = 0;
        querySnapshot.forEach((doc) => this.afs.collection(collectionName).doc(doc.id).delete())
        console.log("Es hat funktioniert");
      })
      .catch((error) => console.error("Error removing document: ", error)
      );
  }

  createID(objData: any){
    return objData.ID = this.afs.createId();
  }

  updateFacilityCollection(collection: string, facilityObj: Facility) {
    return this.afs.collection(collection).doc(facilityObj.ID).update(
      {
        //Updateable fields in update-dialog
        name: facilityObj.name,
        adress: facilityObj.adress,
        type: facilityObj.type.typeName, //this does not change anything in the update-dialog, but also should not change in real case
        capacity: facilityObj.capacity 
      }
    );
  }
  
  updateUsedCapacity(collection: string, facilityObj: IFacility | undefined): void {
  
    if(facilityObj){
       this.afs.collection(collection).doc(facilityObj.ID).update(
        {usedCapacity: facilityObj.usedCapacity + 1}
      );
    }
  }
}
