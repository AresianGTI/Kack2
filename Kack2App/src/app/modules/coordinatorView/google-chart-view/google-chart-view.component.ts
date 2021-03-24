import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, Subscription } from 'rxjs';
import { Facility, FacilityType } from 'src/app/models/facility';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-google-chart-view',
  templateUrl: './google-chart-view.component.html',
  styleUrls: ['./google-chart-view.component.scss']
})
export class GoogleChartViewComponent implements OnInit {
  
  mode: ProgressBarMode = 'determinate';
  subscription!: Subscription;
  convertingArray!: any[];

  //überprüfen, ob das auch anders geht 
  facilityArray: Array<{
    Name: string;
    Kapazitaet: number;
    VerwendeteKapazitaet: number;
    Adresse: string;
    Einrichtungsart: FacilityType;
  }> = []; // ----> muss initialisiert werden, weil undefined nicht gesetzt wird!!!!!!!
//Variablenames have big capital-letter because the document field names in firestore !!!
//Wenn die Buchstaben gleich sind, kann man hier ein Facility-Array verwenden.

  usedFacilities: Array<{}> = [];
  constructor(
    private collectionService: CollectionsService,
    private firestoreService: FirestoreService) { }

  ngOnInit(): void {

     this.usedFacilities = this.firestoreService.getMainFacility(this.collectionService.userCollection, )


    //get ALL facilities for the progress-bar (facilityname and capacity of facility)
    const facilityCol = this.firestoreService.getAllFacilities(this.collectionService.facilityCollection);
    const facilityObservableArray =  facilityCol.valueChanges();

    this.subscription = facilityObservableArray.subscribe(facility => {  //converting in array
       this.convertingArray = facility;
       this.convertingArray.forEach(fclty => {  //push into Array for Progressbar
        this.facilityArray.push(fclty);
       })
       this.calculateUsedCapacity(); 
     });
  }

  //Abfangen, dass verwendete Kapazität die maximale Kapazität nicht übersteigt
  calculateUsedCapacity(){
       //calculate the used mainfacility for progress-bar value
       this.facilityArray.forEach(facility => {
        facility.VerwendeteKapazitaet = 0;
        this.usedFacilities.forEach(uF =>{
          if(uF == facility.Name)
            facility.VerwendeteKapazitaet++;             
        });
        this.subscription.unsubscribe();
      });
  }


}
