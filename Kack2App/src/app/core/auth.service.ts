import { Injectable, NgZone, Testability } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import firebase from 'firebase';
import { Trainee } from '../models/trainee';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap, take } from 'rxjs/operators/';
import { sub } from 'date-fns';
import { GlobalstringsService } from '../services/globalstrings/globalstrings.service';
import { SubscriptionCollectionService } from '../services/subscription-collection.service';
import { FirestoreService } from '../services/firestore/firestore.service';

const secondaryApp = firebase.initializeApp(environment.firebaseConfig, 'Secondary');
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  errorMessage!: String;
  userData: any;
  loginSubscriptions: Subscription[] = [];
  user$: Observable<any>;
  
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public stringService: GlobalstringsService,
    public subscriptionService: SubscriptionCollectionService,
    public firestoreService: FirestoreService // NgZone service to remove outside scope warning
  ) {
    // Authentifizierung wird beim Laden der Seite nicht gespeichert
      this.user$ = this.afAuth.authState.pipe(take(1),switchMap(user => {
      if (user) {
        // firestoreService.getUserData(user, this.loginSubscriptions)
        // this.getUserData(user);
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
        return this.afs.doc<any>(`users/${user.uid}`).valueChanges()
      } else {
        localStorage.setItem('user', this.userData);
        localStorage.getItem('user');
        return of(user);
      }
    }))
  }


  // // Doesn't work correctly
  DestroySubscriptions(){

    const promise = this.loginSubscriptions.forEach(sub =>
      sub.unsubscribe(),
      console.log("Sub unsubscribed"));

      // this.loginSubscriptions = []
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.firestoreService.getUserData(result.user, this.loginSubscriptions)
        .then((data) => {
          this.userData = data;
          this.router.navigate(['/' + this.stringService.overview]);
          console.log("USERDATA: ", this.userData)
        })
      })  
        // this.ngZone.run(() => {
          
        // });
      
      .catch(e => this.errorMessage = e.message);
  }
  SignUp(email: string, password: string, data?: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user!,data);
      })
      .catch(e => this.errorMessage = e.message);
  }


  // Sign up with email/password
  SignUpTrainees(email: string, password: string, data?: any, collection = "users") {
    return secondaryApp.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user!, data);
        secondaryApp.auth().signOut();
      })
      
  }

  // Send email verfificaiton when new user sign up
  // async SendVerificationMail() {
  //   return (await this.afAuth.currentUser)?.sendEmailVerification()
  //     .then(() => {
  //       console.log('email sent');
  //     })
  // }

  // // Reset Forggot password
  // ForgotPassword(passwordResetEmail: any) {
  //   return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
  //     .then(() => {
  //       window.alert('Password reset email sent, check your inbox.');
  //     }).catch((error) => {
  //       window.alert(error)
  //     })
  // }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    // return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(["/" + this.stringService.overview]);
        })
        this.SetUserData(result.user!);
      }).catch((error) => {
        window.alert(error)
      })
  }
  getUserData(user: any) {
    let lel;
      this.loginSubscriptions.push(
        this.afs.collection("users").doc(`/${user.uid}`).valueChanges()
        .subscribe(value =>
          {
            //Subscription muss stoppen
            lel = value
            this.userData = value;
            console.log("RESULT",  this.userData);
            for(let sub in this.loginSubscriptions){
              console.log("ICh bin ein SUBMARINA", sub);
            }
          })
          
      );
      return lel ;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, data?: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc<any>("users" + `/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      emailVerified: user.emailVerified,
      roles: {
        trainee: data?.rolesobj.trainee ,
        admin: data?.rolesobj.admin ,
        coordinator: data?.rolesobj.coordinator
      },
      Stammeinrichtung: data?.home_facility.facilityName || "Keine Stammeinrichtung",
      Nachname: data?.name || "Name No Value",
      Vorname: data?.firstname || "FirstName No Value"
    }
    // Updates existing Documents in a non-destructive way
    return userRef.set(userData, {
      merge: true
    })
  }
  SignOutCreatedUser() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    })
  }
 async SignOut() {
   await this.afAuth.signOut().then(() => {
      // this.subscriptionService.DestroySubscriptions(this.loginSubscriptions)
      this.DestroySubscriptions();
      localStorage.removeItem('user');
      this.router.navigate(['/' + this.stringService.loginView]);
    })
  }


  private checkAuthorization(user: any, allowedRoles: string[]): boolean {
    if (!user) return false

    let saf = false;
    allowedRoles.forEach(role => {
      if(user.roles[role])
      {
        console.log("UserRole[role]",user.roles[role])
        saf = true;
      }
    });
    return saf;
  }
  canRead(user: any): boolean {
    const allowed = ["admin", "trainee", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }
  canEdit(user: any): boolean {
    const allowed = ["admin", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }
}