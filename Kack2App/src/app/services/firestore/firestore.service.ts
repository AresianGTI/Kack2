import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { element } from 'protractor';
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
      console.log("FieldList: ", fieldList)
    return fieldList;
  }
  // getFieldsFromCollectionTT(collection: string, field: string): Promise<any> {
  //   let fieldList: any = [];
  //   return this.afs.collection(collection)
  //     .get().toPromise().then(snapshot => {
  //       snapshot.docs.forEach(doc => {
  //         fieldList.push(doc.get(field));
  //       })
  //       return fieldList;
  //     })
  // }
  
  getUserData = (user: any, subscriptionList?: Subscription[]): Promise<any> => {
    var docRef = this.afs.collection("usersCollection").doc(`/${user.uid}`);
    return docRef.ref.get().then((doc) => {
      return doc.data();
    })
  }
   getData (user: any): Promise<any> {
    var docRef = this.afs.collection("Test").doc(`/${user.ID}`);
    return docRef.ref.get().then((doc) => {
      // console.log("DATA in Neuem getDAta:", doc.data())
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
  updateNotifications(collection: string, objData: any) {
    this.afs.collection(collection).doc(objData.UID).update(objData.notifications).then(res => {
    }).catch(error => {
      console.log(error);
    });
  }

  deleteFieldValue(collection: string, objData: any, itemToDelete : any) {
    this.afs.collection(collection).doc(objData.UID)
    .update({
      items: itemToDelete  
    }).then(res => {
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
  getCompleteDocument = (user: any, collection: string, mapName: string): Promise<any> => {
    var docRef = this.afs.collection(collection).doc(`${user.ID}`);
    return docRef.ref.get().then((doc) => {
      return doc.data()})
     
  }

  // getTraineesInFacility(user: User): Promise<any> {
  //   let arr: any = [];
  //   return this.afs.collection("usersCollection", ref => (ref
  //     .where("homeFacility", "==", user.homeFacility))
  //     .where("role", "==", "trainee"))
  //     .get().toPromise().then(snapshot => {
  //       snapshot.docs.forEach(doc => {
  //         arr.push(doc.data())
  //       })
  //       return arr;
  //     });
  // }
  // getEventType(user: User): Promise<any> {
  //   let arr: any = [];
  //   return this.afs.collection("Test", ref => (ref
  //     .where("", "==", user.homeFacility))
  //     .where("role", "==", "trainee"))
  //     .get().toPromise().then(snapshot => {
  //       snapshot.docs.forEach(doc => {
  //         arr.push(doc.data())
  //       })
  //       return arr;
  //     });
  // }
  getUserInFacility(user: User, role: string): Promise<any>{
    let arr: any = [];
    return this.afs.collection("usersCollection", ref => (ref
      .where("homeFacility", "==", user.homeFacility))
      .where("role", "==", role))
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          arr.push(doc.data())
        })
        return arr;
      });
  }
  // getCoordinatorsInFacility(user: User): Promise<any> {
  //   let arr: any = [];
  //   return this.afs.collection("usersCollection", ref => (ref
  //     .where("homeFacility", "==", user.homeFacility))
  //     .where("role", "==", "coordinator"))
  //     .get().toPromise().then(snapshot => {
  //       snapshot.docs.forEach(doc => {
  //         arr.push(doc.data())
  //       })
  //       return arr;
  //     });
  // }

    //Brauch ich das überhaupt?
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
      console.log("Returned Array: ", arr)
      return arr;
    }


  getAllCollectionItems = (data: any, collection: string, mapName: string): Promise<any> => {
    let arr: any = [];
    return this.afs.collection(collection, ref => ref.where("UID", "==", data.ID))
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log("DocData: ", doc.data())
          let data: any = doc.data();
          try {
            for (const [key, value] of Object.entries(data[mapName])) {
              arr.push([key, value]);
            }
          }
          catch {
            console.log("Keine Daten in der Collection ", collection, " vorhanden")
          }
        })
        console.log("Returned Array: ", arr)
        return arr;
      })
  }
}
