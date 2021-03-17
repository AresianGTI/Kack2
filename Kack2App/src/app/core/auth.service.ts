import { Injectable, NgZone, Testability } from '@angular/core';
import { IUser, Roles } from "../models/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import firebase from 'firebase';
import { Trainee } from '../models/trainee';
import { Facility } from '../models/facility';
import { Coordinators } from '../models/coordinators';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators/';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

const secondaryApp = firebase.initializeApp(environment.firebaseConfig, 'Secondary');
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  errorMessage!: String;
  currentData: any;
  userData: any;
  testData: any;// Save logged in user data
  traineData!: Trainee;
  loggedInData:any;
  userMuser: any;
  loginSubscriptions: Subscription[] = [];
  // Save logged in user data
  // Save logged in user data
  user$: Observable<any>;
  
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning

  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    // this.user$ = this.afAuth.authState.pipe(switchMap(user => {
    //   if (user) {
    //     this.getUserData(user);
    //     this.currentData 
    //     return this.afs.doc<any>(`users/${user.uid}`).valueChanges()
    //   } else {
    //     return of(null);
    //   }
    // }))   
        this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        this.getUserData(user);
        this.loggedInData = user;
        return this.afs.doc<any>(`users/${user.uid}`).valueChanges()
      } else {
        return of(null);
      }
    }))
    //    this.loginSubscriptions.push(this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //      this.getUserData(user);
    //      this.loggedInData = user;
       
    //     localStorage.setItem('user', JSON.stringify(user));
    //     JSON.parse(localStorage.getItem('user')!);
    //     return this.afs.doc<any>(`users/${user.uid}`).valueChanges()
    //     // console.log("User vorhanden", user);
    //   } else {
    //     localStorage.setItem('user', this.currentData);
    //     // console.log(localStorage);
    //     localStorage.getItem('user');
    //     return 0;
    //   }
    // }));
  }

  DestroySubscriptions(){
    this.loginSubscriptions.forEach(sub =>
      sub.unsubscribe());
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['Stammdaten']);
        });
        this.getUserData(result.user!);
      })
      .then(() => {
        console.log("Meine UserDataa in SignIn: " );
      }
      )
      .catch(e => this.errorMessage = e.message);
  }
  SignUp(email: string, password: string, data?: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        // this.SendVerificationMail();
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
    return (user !== null && user.emailVerified !== false) ? true : false;
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
          this.router.navigate(['Stammdaten']);
        })
        this.SetUserData(result.user!);
      }).catch((error) => {
        window.alert(error)
      })
  }
  getUserData(user: any) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc<any>("coordinators" +`/${user.uid}`);
    // let result: any = this.afs.collection("coordinators").doc(user.uid).valueChanges()
    // let collection = "coordinators";
      this.loginSubscriptions.push(
        this.afs.collection("users").doc(`/${user.uid}`).valueChanges()
        .subscribe(value =>
          {
            //Subscription muss stoppen
            this.currentData = value;
            console.log("RESULT",  this.currentData);
            for(const sub in this.loginSubscriptions){
              console.log("ICh bin ein SUBMARINA");
            }
            // this.currentData = user;
          })
          
      );
    // }
  
//  console.log("RESULT", result);
//     console.log("UID", user.uid);

      // p_data.data = elemData;
      // .valueChanges()
      // console.log("was diese jaaaah",this.afs.collection("coordinators").doc(user.uid));
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, data?: any) {
    // this.getUserData(user);
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
    this.testData = userData;
    console.log("UserData", this.testData)
    // Updates existing Documents in a non-destructive way
    return userRef.set(userData, {
      merge: true
    })
  }
  SignOutCreatedUser() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.router.navigate(['login-view']);
    })
  }
  // Sign out 
 async SignOut() {
   await this.afAuth.signOut().then(() => {
      this.DestroySubscriptions();
      localStorage.removeItem('user');
      this.router.navigate(['loginView']);
    })
  }
  // private checkAuthorization(user: any, allowedRoles: string[]): boolean {
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
    const allowed = ["admin", "hehe", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }
  canEdit(user: any): boolean {
    const allowed = ["admin", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }
}