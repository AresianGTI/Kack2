import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  username?: string | null;

  constructor(private router: Router, private auth: AngularFireAuth) {
  }
  logOut() {
    this.auth.signOut().then(() => this.router.navigate(["/loginView"]));
  }

  ngOnInit(): void {
    let test;
    // Wenn User == Admin
    //Navigate to --> Admin
    //Wenn User == Trainee
    //Wenn User == Coordinator
  }

}
