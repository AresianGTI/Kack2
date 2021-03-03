import { stringify } from '@angular/compiler/src/util';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { Facility, FacilityType } from 'src/app/models/facility';

@Component({
  selector: 'app-google-chart-view',
  templateUrl: './google-chart-view.component.html',
  styleUrls: ['./google-chart-view.component.scss']
})
export class GoogleChartViewComponent implements OnInit {
  
  mode: ProgressBarMode = 'determinate';
  value = 30;

  convertingArray!: any[];

  facilityArray: Array<{
    Name: string;
    Kapazitaet: number;
    Adresse: string;
    Einrichtungsart: FacilityType;
  }> = []; // ----> muss initialisiert werden, weil undefined nicht gesetzt wird!!!!!!!
//Variablenames have big capital-letter because the document field names in firestore !!!
//Wenn die Buchstaben gleich sind, kann man hier ein Facility-Array verwenden.

  constructor(private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    const facilityCol = this.store.collection("facilityCollection");
    const facilityObservableArray =  facilityCol.valueChanges();

//KANN MAN DEN CONVERT SCHRITT ÜBERSPRINGEN?

    const traineeCol = this.store.collection("traineeCollection");
    const traineeObservableArray = traineeCol.valueChanges();

    facilityObservableArray.subscribe(facility => {  //converting in array
       this.convertingArray = facility;
       console.log(this.convertingArray);

       this.convertingArray.forEach(fclty => {  //push into Array for Progressbar
        this.facilityArray.push(fclty);
        console.log(this.facilityArray);
       }
       );
     });

  }



}
