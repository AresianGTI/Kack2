import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router)
  {

  }
  ngOnInit(){
    this.router.navigate(["/loginView"]);
  }

  title = 'Kack2App';
}
