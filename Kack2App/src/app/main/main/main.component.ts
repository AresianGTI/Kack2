import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  username?: string | null;

  constructor(private router: Router, private auth: AuthService) {
  }

  logOut() { this.auth.SignOut(); }

  ngOnInit(): void {
    let test;
    this.router.navigate(["/trainee"]);
    // Wenn User == Admin
    //Navigate to --> Admin
    //Wenn User == Trainee
    //Wenn User == Coordinator
  }

}
