import { Injectable, NgZone, Testability } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import firebase from 'firebase';
import { Coordinator, Trainee } from '../models/user';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap, take } from 'rxjs/operators/';
import { GlobalstringsService } from '../services/globalstrings/globalstrings.service';
import { SubscriptionCollectionService } from '../services/subscription-collection.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { CollectionsService } from '../services/collections/collections.service';
import { IUser } from '../models/user';
import { EnumRoles } from '../services/enums/enums.service';
import { IUserFirebaseStructure} from '../models/firestoreModels'

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
    public firestoreService: FirestoreService) {
    
    // Authentifizierung wird beim Laden der Seite nicht gespeichert
      this.user$ = this.afAuth.authState.pipe(take(1),switchMap(user => {
      if (user) {
        this.getUserDataFromFirestore(user);
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
        return this.firestoreService.afs.doc<any>(CollectionsService.userCollection+`/${user.uid}`).valueChanges() //Mal schauen ob Kaki recht hat ...
      } else {
        localStorage.setItem('user', this.userData);
        localStorage.getItem('user');
        return of(user);
      }
    }))
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
      this.getUserDataFromFirestore(result.user);
      this.router.navigate(['/' + GlobalstringsService.overview]);
      })  
      .catch(e => this.errorMessage = e.message);
  }

  getUserDataFromFirestore(result: any){
    this.firestoreService.getUserData(result, this.loginSubscriptions)
    .then((data) => {
      this.userData = data;
      
    })
  } 
  
  SignUpCoordinator(email: string, password: string, userData: Coordinator) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.firestoreService.createDocument(CollectionsService.userCollection, 
          this.setUserData(result.user!, userData));
      })
      .catch(e => this.errorMessage = e.message);
  }

  // Sign up with email/password
  SignUpTrainees(email: string, password: string, data: Trainee, 
    ) {
      //Create Authentication User
    return secondaryApp.auth().createUserWithEmailAndPassword(email, password)
      //Create Trainee Document
      .then((result) => {
        this.firestoreService.createDocument(CollectionsService.userCollection, 
          this.setUserData(result.user!, data));
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
  // AuthLogin(provider: any) {
  //   return this.afAuth.signInWithPopup(provider)
  //     .then((result) => {
  //       this.ngZone.run(() => {
  //         this.router.navigate(["/" + this.stringService.overview]);
  //       })
  //       // this.firestoreService.setUserData(result.user!);
  //       // this.firestoreService.setUserData(this.setUserData(result.user, data));
  //       // this.SetUserData(result.user!);
  //     }).catch((error) => {
  //       window.alert(error)
  //     })
  // }

  setUserData(user: any, data: IUser) {
    const userStructure: IUserFirebaseStructure = {
      ID: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      emailVerified: user.emailVerified,
      role: data.role || "Error, no Role", 
      homeFacility: data.homeFacility.name || "No Homefacility",
      name: data?.name || "No Value",
      firstName: data?.firstName || "No Value"
    }
    // Updates existing Documents in a non-destructive way
    return userStructure;
  }
  SignOutCreatedUser() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    })
  }
 async SignOut() {
   await this.afAuth.signOut().then(() => {
      this.subscriptionService.DestroySubscriptions(this.loginSubscriptions)
      localStorage.removeItem('user');
      this.router.navigate(['/' + GlobalstringsService.loginView]);
    })
  }
  
  private checkAuthorization(user: any, allowedRoles: string[]): boolean {
    if (!user) return false
    let isAuthorized = false;
    allowedRoles.forEach(role => {
    if(user.role == role)
    {
      isAuthorized = true;
    }
  });
  return isAuthorized;
   }
     
  canRead(user: any): boolean {
    const allowedRoles = [EnumRoles.admin, EnumRoles.coordinator, EnumRoles.trainee, EnumRoles.teacher];
    return this.checkAuthorization(user, allowedRoles)
  }
  canEdit(user: any): boolean {
    const allowedRoles = [EnumRoles.admin, EnumRoles.coordinator];
    return this.checkAuthorization(user, allowedRoles)
  }
}