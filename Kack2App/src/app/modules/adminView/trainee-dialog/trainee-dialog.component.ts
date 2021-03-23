import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/auth.service';
import { Trainee } from 'src/app/models/trainee';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit {

  traineeObj: Trainee = new Trainee();
  facilityList: any[] = []
  errorMessage!: string;

  constructor(public firestore: AngularFirestore, 
    private auth: AngularFireAuth,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.onQuery( this.firestore.collection('facilityCollection'));
    // this.onQuery( this.firestore.collection('users', ref => ref
    // .where("roles.trainee", "==", true)));
  }


  createTrainee() {
   this.traineeObj.rolesobj.trainee = true;
    this.authService.SignUpTrainees(this.traineeObj.email, "hund111", this.traineeObj).then(() => {

      //Reset Methode? FirestoreService
        this.traineeObj.name = "";
        this.traineeObj.firstname = "";
        this.traineeObj.email = "";
        this.traineeObj.home_facility.name = "";
        }
        )
  }

  //FirestoreService // Zeigt nur die bestehenden Einrichtugnen an 
  onQuery(p_collection: AngularFirestoreCollection<unknown>) {
    this.facilityList = [];
    p_collection 
      .get()
      .subscribe(ss => {
        ss.docs.forEach(doc => {
          this.facilityList.push(doc.get("Name"));
        })
      }
      )
  }

}
