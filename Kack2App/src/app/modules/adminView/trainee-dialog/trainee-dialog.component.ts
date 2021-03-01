import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Trainee } from 'src/app/models/trainee';

@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit {

  traineeObj: Trainee = new Trainee();
  facilityList: any[] = []
  errorMessage!: string;

  constructor(public firestore: AngularFirestore, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.onQuery(this.firestore.collection('facilityCollection'));
  }

  createTrainee() {

    let traineeData =
    {
      Nachname: this.traineeObj.name,
      Vorname: this.traineeObj.firstname,
      Email: this.traineeObj.email,
      Stammeinrichtung: this.traineeObj.home_facility.facilityName
    };

    //Regist User for Authentication
      this.auth.createUserWithEmailAndPassword(traineeData.Email, "hund111").then(hs => {
        console.log("RegisterComponent --> createUser", hs)}).catch(err => console.log(err.message));

    // Save inside the TraineeCollection for data-use
      this.firestore.collection('traineeCollection').add(traineeData).then(res => {
        this.traineeObj.name = "";
        this.traineeObj.firstname = "";
        this.traineeObj.email = "";
        this.traineeObj.home_facility.facilityName = "";
        console.log("test", res);
        alert("Der Azubi wurde erstellt!");
      });


  }


  onQuery(p_collection: AngularFirestoreCollection<unknown>) {
    this.facilityList = [];
    p_collection
      // , ref => ref
      // .where("name", ">=", "")
      .get()
      .subscribe(ss => {
        ss.docs.forEach(doc => {
          this.facilityList.push(doc.get("Name"));
          console.log("Data FacilityElems", doc.get("Name"));
        })
      }
      )
    console.log("testarr", this.facilityList);
  }

}
