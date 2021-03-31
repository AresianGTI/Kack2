import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, Subscription } from 'rxjs';
import { Facility, FacilityType } from 'src/app/models/facility';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';

@Component({
  selector: 'app-google-chart-view',
  templateUrl: './google-chart-view.component.html',
  styleUrls: ['./google-chart-view.component.scss']
})
export class GoogleChartViewComponent implements OnInit, OnDestroy {
  
  mode: ProgressBarMode = 'determinate';
  subscription: Subscription[] = [];
  convertingArray: any[] = [];

  //getFactilityStructure Klasse
  facilityArray: Array<{
    ID: string;
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
    private firestoreService: FirestoreService,
    public subscriptionService: SubscriptionCollectionService){
    }

  ngOnInit(): void {
     this.usedFacilities = this.firestoreService.getFieldsFromCollection(this.collectionService.userCollection, "homeFacility" )

    //get ALL facilities for the progress-bar (facilityname and capacity of facility)
    const facilityCol = this.firestoreService.getAllFacilities(this.collectionService.facilityCollection);
    const facilityObservableArray =  facilityCol.valueChanges();

    this.subscription.push(facilityObservableArray.subscribe((facility) => {  //converting in array
      this.convertingArray = facility;
      this.convertingArray.forEach(fclty => {  //push into Array for Progressbar
       this.facilityArray.push(fclty);
       this.subscriptionService.DestroySubscriptions(this.subscription);
      })
    }))
    this.facilityArray.length = 0;
  }

  ngOnDestroy(){
    //Reset All...
    // this.subscriptionService.DestroySubscriptions(this.subscription);
    console.log("facilityArray: ", this.facilityArray);
    console.log("convertingarray: ", this.convertingArray);
    this.facilityArray.length = 0;
    this.convertingArray.length = 0;
  }


  // //Berechnet die Kapazitäten für jede Einrichtung ohne verwendete Kapazitäten direkt auszulesen
    // Nützlich, nachdem eine Einrichtung gelöscht wird, aber Azubis noch drin sind...
  // calculateUsedCapacity(){
  //   //calculate the used mainfacility for progress-bar value
  //   this.facilityArray.forEach(facility => {
  //    facility.VerwendeteKapazitaet = 0;
  //    this.usedFacilities.forEach(uF =>{
  //      if(uF == facility.Name)
  //        facility.VerwendeteKapazitaet++;             
  //    });

  //  });

  // }
  }
