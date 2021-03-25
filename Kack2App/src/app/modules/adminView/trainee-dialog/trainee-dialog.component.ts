import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/auth.service';
import { Trainee } from 'src/app/models/trainee';
import { take } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CollectionsService } from 'src/app/services/collections/collections.service';
@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit {

  traineeObj: Trainee = new Trainee();
  facilityList: any[] = []
  constructor(
    public fireStoreService: FirestoreService,
    public authService: AuthService,
    public collectionService: CollectionsService,
    ) { }
    
  ngOnInit(): void {
    this.facilityList =  this.fireStoreService.getFieldsFromCollection( this.collectionService.facilityCollection, "Name")
      console.log("Das sind die Data im Dialog", this.facilityList);
    // this.onQuery( this.firestore.collection('users', ref => ref
    // .where("roles.trainee", "==", true)));
  }

  createTrainee() {
  //  this.traineeObj.rolesobj.trainee = true;
    this.authService.SignUpTrainees(this.traineeObj.email, "hund111", this.traineeObj).then(() => {
      //Reset Methode? FirestoreService
        this.traineeObj.name = "";
        this.traineeObj.firstName = "";
        this.traineeObj.email = "";
        this.traineeObj.homeFacility.name = "";
        })
  }
}
