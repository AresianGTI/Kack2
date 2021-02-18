import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private auth: AngularFireAuth)
  {

  }
  ngOnInit(){
    // if(this.auth.currentUser)
    // {
    //   this.auth.currentUser.then(hs => {
    //     console.log("User Logged In JAJA", hs);
    //     this.router.navigate(["/Main"]);
    //   })
    // }
    // else{
    //   this.router.navigate(["/loginView"]);
    // }
  
    // this.router.navigate(["/loginView"]);
  }

  title = 'Kack2App';
}
