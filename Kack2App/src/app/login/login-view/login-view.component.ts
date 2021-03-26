import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'
import { Coordinator } from 'src/app/models/coordinator';
import { GlobalstringsService } from 'src/app/services/globalstrings/globalstrings.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCoordinatorDialogComponent } from '../create_coordinator-dialog/create-coordinator-dialog/create-coordinator-dialog.component';
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
    public glob: GlobalstringsService,
    public coordinatorDialog: MatDialog) {
  }
  ngOnInit(): void {
  }

  SignIn(email: string, pw: string) {
    //Create User Object
    this.authService.SignIn(email, pw);
  }

  openCreateCoordinatorDialog() {
    this.coordinatorDialog.open(CreateCoordinatorDialogComponent);
  }

}