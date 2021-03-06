import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import{AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {AuthService} from '../../core/auth.service'
import { Coordinators } from 'src/app/models/coordinators';
@Component({
  selector: 'app-register',
  templateUrl: './login-View.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  // loginForm!: FormGroup;
  // readonly email = new FormControl('', [Validators.required]);
  // readonly password = new FormControl('', [Validators.required]);
  loginForm!: FormGroup;
  // errorMessage!: String;
  readonly email = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);

  constructor(
    private fb:FormBuilder, 
    private auth: AngularFireAuth, 
    private router: Router,
    public authService: AuthService) {
    //  if(this.authService.isLoggedIn()) {
    //     this.router.navigate(['overview']);
    //   }
    
   }
  //  coorindator = new Coordinators();
ngOnInit(): void{}

createCoordinator(email: string, pw: string){
  let coorindator = new Coordinators();
  // coorindator.rolesobj.coordinator = true;
  this.authService.SignUp(email,  pw, coorindator);
}
SignIn(email: string, pw: string){
  let coorindator = new Coordinators();
  //Create User Object
  // this.authService.SignIn(email,  pw, this.userObj, "coordinators");
  // coorindator.rolesobj.coordinator = true;
  this.authService.SignIn(email,  pw);
}
  // ngOnInit(): void {
  //   // this.loginForm = new FormGroup({
  //   //   email: this.email,
  //   //   password: this.password
  //   // })
  //   this.loginForm = new FormGroup({
  //     email: this.email,
  //     password: this.password
  //   })
  //   this.auth
  // }
  // createUser(){
  //   const {email, password} = this.loginForm.value;
  //   this.auth.createUserWithEmailAndPassword(email, password).then(hs =>{
  //     console.log("RegisterComponent --> createUser", hs);
  //     this.router.navigate(["/Main"]);
  //   })
  //   .catch(e => this.errorMessage = e.message);
  //   console.log("loginform Value: ", this.loginForm.value);
  // }
  // signIn(){
  //   const {email, password} = this.loginForm.value; //Destructuring
  //   this.auth.signInWithEmailAndPassword(email, password)
  //   .then(hs =>{
  //     console.log("User Logged In", hs);
  //     this.router.navigate(["/Main"]);
  //   }).catch(e => this.errorMessage = e.message);
  //   // this.se
  // }


}