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
    public collectionService: CollectionsService) {
  }

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

  getUserData = (user: any, subscriptionList?: Subscription[]): Promise<any> => {
    var docRef = this.afs.collection("usersCollection").doc(`/${user.uid}`);
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
  updateDocument(collection: string, objData: any) {
    let obj = Object.assign({}, [objData])
  //   let elems: any[] = [];
  // let id  = objData[0].UID;
  //   objData.forEach((element: any) => {
  //     elems.push(element);
  //     console.log("Element: ", element)
  //     console.log("UID: ", element.UID)
  //     id = element.UID;
  //   });
  //   console.log("IDDDDD: ", id);
  //    console.log("Elements: ", elems);
    this.afs.collection(collection).doc(objData.UID).set(objData).then(res => {
    }).catch(error => {
      console.log(error);
    });
  }
  // setDocument(collection: string, objData: any) {
  //   objData.forEach((element: any) => {
  //     console.log("Element: ", element)
  //     console.log("UID: ", element.UID)
  //     this.afs.collection(collection).doc(element.UID).set(element).then(res => {
  //     }).catch(error => {
  //       console.log(error);
  //     });
  //   });
  // }
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

  createID(objData?: any) {
    if (objData) {
      return objData.ID = this.afs.createId();
    }
    else {
      return this.afs.createId();
    }
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
