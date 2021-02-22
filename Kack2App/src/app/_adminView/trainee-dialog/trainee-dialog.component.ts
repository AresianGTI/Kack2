import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
  }

  createTrainee(){

    let data =
      {Nachname: this.traineeObj.name,
      Vorname: this.traineeObj.firstname,
      Stammeinrichtung: this.traineeObj.home_facility}
    ;
    
    this.firestore.collection('facilityElementsOnur2').add(data).then(res =>{
      this.traineeObj.name = "";
      this.traineeObj.firstname = "";
      this.traineeObj.home_facility.facilityName = "";
      console.log("test", res);
      alert("Die Einrichtung wurde erstellt!");
    }).catch(error =>{
      console.log(error);
    });
  }

}
