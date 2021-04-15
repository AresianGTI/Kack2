import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Facility, IFacility } from 'src/app/models/facility';
import { IFacilityFirebaseStructure } from 'src/app/models/firestoreModels';
import { Trainee } from 'src/app/models/user';
import { CollectionsService } from '../collections/collections.service';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  constructor(public afs: AngularFirestore) {
  }

  //---GET REGION---
  getAllFacilities(collection: string) {
    return this.afs.collection(collection);
  }

  getFieldsFromCollection(collection: string, field: string): Array<any> {
    let fieldList: Array<{}> = [];
    this.afs.collection(collection)
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          fieldList.push(doc.get(field));
        })
      })
    return fieldList;
  }

  getUserData (user: any, subscriptionList: Subscription[]): Promise<any> {
    var docRef = this.afs.collection(CollectionsService.userCollection).doc(`/${user.uid}`);
    return docRef.ref.get().then((doc) => {
      return doc.data();
    })
  }

  //---CREATE REGION---
  createID(objData: any) {
    return objData.ID = this.afs.createId();
  }
  // Setting up user and facilities
   createDocument(collection: string, objData: any) {
    this.afs.collection(collection).doc(objData.ID).set(objData).then(res => {
    }).catch(error => {
      console.log(error);
    });
  }

  //---DELETE REGION---
   deleteDocument(data: any, collection: string) {
    this.afs.collection(collection).doc(data.ID).delete();
  }

  /**
   * Deletes all facilities and all trainees inside the facilities   
   *@returns No return value
   */
   deleteAllFacilities(facilityCollection: string, userCollection: string): void {
    //Delete every single facility by using the ID
    this.afs.collection(facilityCollection)
      .get()
      .toPromise()
      .then(querySnapshot => {
        querySnapshot.forEach((facilityDocument) => {
          this.afs.collection(facilityCollection)
            .doc(facilityDocument.id)
            .delete();
          //Also delete all trainees inside the deleted facility
          this.deleteAllTraineesInsideFacility(facilityDocument.get('name'));
        });
      })
      .catch((error) => console.error("Error removing facility: ", error)
      );
  }

   deleteAllTraineesInsideFacility(homeFacility: string){
    let userCollection =  CollectionsService.userCollection;
    this.afs.collection(userCollection, ref => ref.where('homeFacility', '==', homeFacility))
    .get().toPromise().then(querySnapshot => {
      querySnapshot.forEach((doc) => this.afs.collection(userCollection).doc(doc.id).delete())
    })
    .catch((error) => console.error("Error removing Users: ", error)
    );
  }

   deleteAllUserWithDesiredRole(collection: string, role: string) {
    this.afs.collection(collection, ref => ref.where('role', '==', role)) // only deletes users with role 'trainee'
      .get()
      .toPromise()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => this.afs.collection(collection).doc(doc.id).delete())
        console.log("Es hat funktioniert");
      })
      .catch((error) => console.error("Error removing Users: ", error)
      );
  }



  //---UPDATE REGION---
   updateFacilityCollection(collection: string, facilityObj: Facility) {
    return this.afs.collection(collection).doc(facilityObj.ID).update(
      {
        //Updateable fields in update-dialog
        //hardcoded...
        name: facilityObj.name,
        adress: facilityObj.adress,
        type: facilityObj.type.typeName, //this does not change anything in the update-dialog, but also should not change in real case
        capacity: facilityObj.capacity
      }
    );
  }

   updateTraineeCollection(collection: string, traineeObj: Trainee) {
    this.afs.collection(collection).doc(traineeObj.ID).update({
      //hardcoded... besser: ganzes Object mit der Datenbankstruktur übergeben
      firstName: traineeObj.firstName,
      name: traineeObj.name,
      homeFacility: traineeObj.homeFacility.name
    });
  }

   updateUsedCapacity(collection: string, facilityObj: IFacility | undefined): void {

    if (facilityObj) {
      this.afs.collection(collection).doc(facilityObj.ID).update(
        { usedCapacity: facilityObj.usedCapacity + 1 }
      );
    }
  }
}
