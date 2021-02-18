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
    //  if(this.authService.isLoggedIn()) {
    //     this.router.navigate(['overview']);
    //   }
    
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
<<<<<<< HEAD
      this.router.navigate(["/MainView"]);
    });
    console.log(this.loginForm.value);
    this.router.navigate(["/MainView"]);
=======
      this.router.navigate(["/Main"]);
    });
    console.log(this.loginForm.value);
>>>>>>> 654ec4e2a4fa23e86432ceccefcf128110aa04d5
  }
  signIn(){
    const {email, password} = this.loginForm.value;
    this.auth.signInWithEmailAndPassword(email, password).then(hs =>{
      console.log("User Logged In", hs);
<<<<<<< HEAD
      this.router.navigate(["/MainView"]);
=======
      this.router.navigate(["/Main"]);
>>>>>>> 654ec4e2a4fa23e86432ceccefcf128110aa04d5
    });
    // console.log(this.loginForm.value);
    
    
  }

}