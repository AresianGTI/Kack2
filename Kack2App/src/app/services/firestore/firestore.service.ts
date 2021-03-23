import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CollectionsService } from '../collections/collections.service';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public afs: AngularFirestore,
    public collectionService: CollectionsService) {

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

  setUserData(user: any, data?: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc<any>(this.collectionService.userCollection + `/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      emailVerified: user.emailVerified,
      roles: {
        trainee: data?.rolesobj.trainee,
        admin: data?.rolesobj.admin,
        coordinator: data?.rolesobj.coordinator
      },
      Stammeinrichtung: data?.home_facility.facilityName || "No Homefacility",
      Nachname: data?.name || "No Value",
      Vorname: data?.firstname || "No Value"
    }
    // Updates existing Documents in a non-destructive way
    return userRef.set(userData, {
      merge: true
    })
  }


  deleteData(data: any, collec: string) {
    // console.log("DataSource Realtalk", this.facilityCollection);
    return this.afs.collection(collec).doc(data.ID).delete();
  }

  deleteAll(collection: any, collectionName:string) {

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
}
