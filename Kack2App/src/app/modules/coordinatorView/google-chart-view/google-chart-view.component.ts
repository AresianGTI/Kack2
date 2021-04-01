import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, Subscription } from 'rxjs';
import { Facility, FacilityType, IFacility } from 'src/app/models/facility';
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
  facilityArray: IFacility[] = [];

  constructor(
    private collectionService: CollectionsService,
    private firestoreService: FirestoreService,
    public subscriptionService: SubscriptionCollectionService){
    }

  ngOnInit(): void {
    const facilityCol = this.firestoreService.getAllFacilities(this.collectionService.facilityCollection);
    const facilityObservableArray =  facilityCol.valueChanges();

    this.subscription.push(facilityObservableArray.subscribe((facility) => {
      this.convertingArray = facility;
      this.convertingArray.forEach(fclty => {
       this.facilityArray.push(fclty);  // Progressbar content
       this.subscriptionService.DestroySubscriptions(this.subscription);
      })
    }))
  }

  ngOnDestroy(){
    //Reset All...
    this.facilityArray.length = 0;
    this.convertingArray.length = 0;
  }

  // //Berechnet die Kapazitäten für jede Einrichtung ohne verwendete Kapazitäten direkt auszulesen
    // Nützlich, nachdem eine Einrichtung gelöscht wird, aber Azubis noch drin sind...
  // calculateUsedCapacity(){
  //   //calculate the used mainfacility for progress-bar value
  //   this.facilityArray.forEach(facility => {
  //    facility.VerwendeteKapazitaet = 0;
  //    this.usedFacilities.forEach(uF =>{  //      this.usedFacilities = this.firestoreService.getFieldsFromCollection(this.collectionService.userCollection, "homeFacility" )
  //      if(uF == facility.Name)
  //        facility.VerwendeteKapazitaet++;             
  //    });

  //  });

  // }
  }
