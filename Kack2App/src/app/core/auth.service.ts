import { Injectable, NgZone, Testability } from '@angular/core';
import { User, Roles } from "../models/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import firebase from 'firebase';
import { Trainee } from '../models/trainee';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  errorMessage!: String;
  userData: any; 
  testData!: User;// Save logged in user data
  traineData!: Trainee;
 // Save logged in user data
 // Save logged in user data
  // testUser: any;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.SetUserData(user);
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
        console.log("User vorhanden");
      } else {
        localStorage.setItem('user', "Test");
        console.log(localStorage);
        localStorage.getItem('user');
      }
    })
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['Stammdaten']);
        });
        this.SetUserData(result.user!);
        console.log(this.SetUserData(result.user!));
      })
      .catch(e => this.errorMessage = e.message);
      

      // const {email, password} = this.loginForm.value;
      // this.auth.signInWithEmailAndPassword(email, password)
      // .then(hs =>{
      //   console.log("User Logged In", hs);
      //   this.router.navigate(["/Main"]);
      // });
  }

  // Sign up with email/password
  SignUp(email: string, password : string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user!);
      })
      .catch(e => this.errorMessage = e.message);
    //   const {email, password} = this.loginForm.value;
    // this.auth.createUserWithEmailAndPassword(email, password).then(hs =>{
    //   console.log("RegisterComponent --> createUser", hs);
    //   this.router.navigate(["/Main"]);
    // });
    // console.log("loginform Value: ", this.loginForm.value);
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return (await this.afAuth.currentUser)?.sendEmailVerification()
    .then(() => {
      console.log('email sent');
    })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

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
      this.SetUserData(result.user! );
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc<User>(`users/${user.uid}`);
    // const test: User ={
    //   uid: user.uid,
    //   email: user.email!,
    //   displayName: user.displayName!,
    //   emailVerified: user.emailVerified,
    //   test: "Test111",
    //   roles: {
    //     trainee: true
    //   }
    // }
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      emailVerified: user.emailVerified,
      test: "Test",
      roles: {
        trainee: true
      },
      name: "TestName",
      firstname:"TestFirstName"

    }
    this.testData = userData;
    console.log("UserData", this.testData)
    // Updates existing Documents in a non-destructive way
    return userRef.set(userData, {
      merge: true
    })
  }
  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login-view']);
    })
  }
  private checkAuthorization (user: User, allowedRoles: string[]):boolean
  {
    if(!user) return false
      if(user.roles.admin){
        return true;
      }
      else if(user.roles.coordinator){
        return true;
      }
      else if(user.roles.trainee){
        return true;
      }
    return false;
  }
  canRead(user:User):boolean{
    const allowed = ["admin", "trainee", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }
  canEdit(user: User): boolean{
    const allowed = ["admin", "coordinator"];
    return this.checkAuthorization(user, allowed)
  }


}