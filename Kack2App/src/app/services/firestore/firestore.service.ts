import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public afs: AngularFirestore) { 

  }
    getUserData(user: any, subscriptionList: Subscription[]) {
      let userData;
      //Check ob subscription schon vorhanden ist--> Wenn ja soll keine weitere Subscription erstellt werden
      subscriptionList.push(
        this.afs.collection("users").doc(`/${user.uid}`).valueChanges()
        .subscribe(value =>
          {
            //Subscription muss stoppen
            // this.userData = value;
            userData = value;
            console.log("RESULT",  value);
            // for(let sub in subscriptionList){
            //   console.log("ICh bin ein SUBMARINA", sub);
            // }
          })
          
      );
      console.log("UserData: ", userData);
      return userData;

  }
}
