import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Trainee } from 'src/app/models/trainee';

@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit {

  traineeObj: Trainee = new Trainee(); 

  constructor(public firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.onQuery( this.firestore.collection('facilityCollection'));
  }

  createTrainee(){
    
    // this.traineeObj.home_facility
    let data =
      {Nachname: this.traineeObj.name,
      Vorname: this.traineeObj.firstname,
      Stammeinrichtung: this.traineeObj.home_facility.facilityName}
    ;
    
    this.firestore.collection('traineeCollection').add(data).then(res =>{
      this.traineeObj.name = "";
      this.traineeObj.firstname = "";
      this.traineeObj.home_facility.facilityName = "";
      console.log("test", res);
      alert("Der Azubi wurde erstellt!");
    }).catch(error =>{
      console.log(error);
    });
  }
  facilityList: any[] = []
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
