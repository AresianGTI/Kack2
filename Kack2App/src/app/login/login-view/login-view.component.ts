import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'
import { Coordinators } from 'src/app/models/coordinators';
import { GlobalstringsService } from 'src/app/services/globalstrings/globalstrings.service';
@Component({
  selector: 'app-register',
  templateUrl: './login-View.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  loginForm!: FormGroup;
  readonly email = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);

  constructor(
    public authService: AuthService,
    public glob: GlobalstringsService) {
  }
  ngOnInit(): void {
  }

  createCoordinator(email: string, pw: string) {
    let coorindator = new Coordinators();
    this.authService.SignUp(email, pw, coorindator);
  }
  SignIn(email: string, pw: string) {
    //Create User Object
    this.authService.SignIn(email, pw);
  }
}