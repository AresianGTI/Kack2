import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { Facility } from 'src/app/models/facility';
import { Trainee } from 'src/app/models/trainee';
import { User } from 'src/app/models/user';
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
  getData = (user: any): Promise<any> => {
    var docRef = this.afs.collection("Test").doc(`/${user.uid}`);
    return docRef.ref.get().then((doc) => {
      console.log("DATA in Neuem getDAta:", doc.data())
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
    this.afs.collection(collection).doc(objData.UID).set(objData).then(res => {
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
  // updateTrainees(collection: string, data:any) {

  //   return this.afs.collection(collection).doc(data.ID).update(
  //     {
  //       homeFacility: data.homeFacility
  //     }
  //   );
  // }
  mapUserDataToObject = (user: any, collection: string, mapName: string): Promise<any> => {
    var docRef = this.afs.collection(collection).doc(`${user.ID}`);
    return docRef.ref.get().then((doc) => {
      return this.mapFirebaseEntryToObject(doc.data(), collection, mapName);
    })
  }
  mapFirebaseEntryToObject(data: any, collectionName: string, mapName: string) {
    let arr = [];
    try {
      for (const [key, value] of Object.entries(data[mapName])) {
        arr.push([key, value]);
      }
    }
    catch {
      console.log("Keine Daten in der Map ", mapName, " in der ausgewählten ",
        collectionName, "vorhanden")
    }
    return arr;
  }
  getbbb(user: User): Promise<any>
  {
    let arr: any = [];
    let data: any;
   return this.afs.collection("usersCollection", ref => (ref
      .where("homeFacility", "==", user.homeFacility))
      .where("role", "==", "trainee"))
      // this.afs.collection("usersCollection", ref => ref.where("role", "==", "trainee"))
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          // console.log("Trainees: ", doc.data())
          arr.push(doc.data())
        })
        return arr;
      });
  }

  getAllCollectionItems = (data: any , collection: string, mapName: string): Promise<any> => {
    let arr: any = [];
    console.log("User IDs",data.ID, " in actual Facility")
      // data sind unten undefined weil asyncrhon läuft
// data.forEach(element => {
//   console.log("Elem UID: ", element.uid)
// });
    return this.afs.collection(collection, ref => ref.where("UID", "==", data.ID))
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log("DocData: ", doc.data())
          // let arr =  this.mapFirebaseEntryToObject(doc, collection, mapName)

          let data: any = doc.data();
          try {
            for (const [key, value] of Object.entries(data[mapName])) {
              arr.push([key, value]);
            }
            // console.log("aarrrr: ", arr)
          }
          catch {
            console.log("Keine Daten in der Collection ", collection, " vorhanden")
          }
        })
        return arr;
      })
  }
}
