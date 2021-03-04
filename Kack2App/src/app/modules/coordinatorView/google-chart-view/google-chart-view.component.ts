import { stringify } from '@angular/compiler/src/util';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatProgressBar, ProgressBarMode } from '@angular/material/progress-bar';
import { Observable, Subscription } from 'rxjs';
import { Facility, FacilityType } from 'src/app/models/facility';

@Component({
  selector: 'app-google-chart-view',
  templateUrl: './google-chart-view.component.html',
  styleUrls: ['./google-chart-view.component.scss']
})
export class GoogleChartViewComponent implements OnInit {
  
  mode: ProgressBarMode = 'determinate';
  subscription!: Subscription;
  convertingArray!: any[];

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
  constructor(private store: AngularFirestore,
    private changeDetectorRefs: ChangeDetectorRef) { }



  ngOnInit(): void {

//KANN MAN DEN CONVERT SCHRITT ÜBERSPRINGEN?

     //Get the seperate mainfacilities of all trainees
     this.subscription = this.store.collection("traineeCollection")
      .get()
      .subscribe( trainee => {
        trainee.docs.forEach(element => {
          this.usedFacilities.push(element.get("Stammeinrichtung"));
        });
        console.log(this.usedFacilities); // Array mit den Stammdaten
       // unsubscribe = false;
     });


    //get all facilities for the progress-bar (facilityname and capacity of facility)

    const facilityCol = this.store.collection("facilityCollection");
    const facilityObservableArray =  facilityCol.valueChanges(); //.get()?

    this.subscription = facilityObservableArray.subscribe(facility => {  //converting in array
       this.convertingArray = facility;
       this.convertingArray.forEach(fclty => {  //push into Array for Progressbar
        this.facilityArray.push(fclty);
       })
       this.calculateUsedFacility();
       
     });

    //  this.convertingArray.length = 0; // Array leeren, ohne es zu verändern
    //  this.facilityArray.length = 0;
    // funktioniert nicht am Ende von ngOnInit() ?!?!?!?!?
  }

  calculateUsedFacility(){
       //calculate the used mainfacility for progress-bar value
       this.facilityArray.forEach(facility => {
        facility.VerwendeteKapazitaet = 0;
        this.usedFacilities.forEach(uF =>{
          if(uF == facility.Name){
            facility.VerwendeteKapazitaet++;
            console.log("Einrichtung:",facility.Name, "hat: ", facility.VerwendeteKapazitaet);
          }
        });
        console.log("unsubscribed");
        this.subscription.unsubscribe();
      });
  }




}
