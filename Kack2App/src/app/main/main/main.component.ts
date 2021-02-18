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
    // this.router.navigate(["/adminMainView"]);

    this.auth.currentUser.then(hs => {
      console.log("User Logged In JAJA", hs);
      this.username = hs?.email;
    })
  }

}
