import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import{AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {AuthService} from '../../core/auth.service'
@Component({
  selector: 'app-register',
  templateUrl: './login-View.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  // loginForm!: FormGroup;
  // readonly email = new FormControl('', [Validators.required]);
  // readonly password = new FormControl('', [Validators.required]);

  constructor(
    private fb:FormBuilder, 
    private auth: AngularFireAuth, 
    private router: Router,
    public authService: AuthService) {
    //  if(this.authService.isLoggedIn()) {
    //     this.router.navigate(['overview']);
    //   }
    
   }

  ngOnInit(): void {
    // this.loginForm = new FormGroup({
    //   email: this.email,
    //   password: this.password
    // })
  }


}