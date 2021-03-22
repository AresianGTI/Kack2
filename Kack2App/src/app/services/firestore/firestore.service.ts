import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GlobalstringsService } from '../globalstrings/globalstrings.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public afs: AngularFirestore) { 

  }



  
    getUserData = (user: any, subscriptionList: Subscription[]): Promise<any> =>{
      var docRef = this.afs.collection("users").doc(`/${user.uid}`);
      return docRef.ref.get().then((doc) =>{
        return doc.data();
      } )

      }
       
        // value =>
        //   {
        //     //Subscription muss stoppen
        //     // this.userData = value;
        //     userData = value;
        //     console.log("RESULT",  value);
        //     return userData;
        //     // for(let sub in subscriptionList){
        //     //   console.log("ICh bin ein SUBMARINA", sub);
        //     // }
        //   })
          // console.log("UserData: ", userData);
      // );
      // return userData;
      
      // return subject;

  // }
}
