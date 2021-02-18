import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import{AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './login-View.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  loginForm!: FormGroup;
  
  constructor(private fb:FormBuilder, private auth: AngularFireAuth, private router: Router) {


    
   }

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {email: ['', Validators.required],
      password:['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    },
    )
  }
  createUser(){
    const {email, password} = this.loginForm.value;
    this.auth.createUserWithEmailAndPassword(email, password).then(hs =>{
      console.log("RegisterComponent --> createUser", hs);
      this.router.navigate(["/MainView"]);
    });
    console.log(this.loginForm.value);
    this.router.navigate(["/MainView"]);
  }
  signIn(){
    const {email, password} = this.loginForm.value;
    this.auth.signInWithEmailAndPassword(email, password).then(hs =>{
      console.log("User Logged In", hs);
      this.router.navigate(["/MainView"]);
    });
    // console.log(this.loginForm.value);
    
    
  }

}