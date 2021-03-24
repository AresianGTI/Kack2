import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Facility } from 'src/app/models/facility';
import { CollectionsService } from '../collections/collections.service';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public afs: AngularFirestore,
    public collectionService: CollectionsService) {  }

  getExistingFacilities(collection: string):Array<any> {
    let list: any[] = [];
    this.afs.collection(collection)
      .get().toPromise().then(ss => {
        ss.docs.forEach(doc => { 
          list.push(doc.get("Name"));
        })
      })
      return list;
  }

  getUserData = (user: any, subscriptionList: Subscription[]): Promise<any> => {
    var docRef = this.afs.collection("users").doc(`/${user.uid}`);
    return docRef.ref.get().then((doc) => {
      return doc.data();
    })
  }

/* Setting up user data when sign in with username/password, 
 sign up with username/password and sign in with social auth  
 provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
 

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

  updateCollection(collection: string, facility: Facility) {

    return this.afs.collection(collection).doc(facility.ID).update(
      {
        Name: facility.name,
        Adresse: facility.adress,
        Einrichtungsart: facility.type.typeName,
        Kapazitaet: facility.capacity
      }
    );
  }

 
}
