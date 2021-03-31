import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Trainee } from 'src/app/models/user';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';
import { Subscription } from 'rxjs';
import { Facility, FacilityType } from 'src/app/models/facility';
@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit, OnDestroy {

  traineeObj: Trainee = new Trainee();

  //getFacilityStructure Klasse
  dialogfacilityArray: Array<{
    ID: string;
    Name: string;
    Kapazitaet: number;
    VerwendeteKapazitaet: number;
    Adresse: string;
    Einrichtungsart: FacilityType;
  }> = [];

  selectedFacility: any; //getFacilityStructure
  facilityCollection!: any;
  convertingArray: any;
  subscription: Subscription[] = [];

  constructor(
    public fireStoreService: FirestoreService,
    public authService: AuthService,
    public collectionService: CollectionsService,
    public subscriptionService: SubscriptionCollectionService
  ) { }

  ngOnDestroy(): void {
    this.subscriptionService.DestroySubscriptions(this.subscription);
  }

  ngOnInit(): void {
    this.getSelectionFacilities();
  }

  getSelectionFacilities(){
    this.facilityCollection = this.fireStoreService.getAllFacilities(this.collectionService.facilityCollection);
    const facilityObservableArray = this.facilityCollection.valueChanges();

    this.subscription.push(facilityObservableArray.subscribe((facility: any) => {  //converting in array
      this.convertingArray = facility;
      this.convertingArray.forEach((fclty: any) => {
        this.dialogfacilityArray.push(fclty);
        this.subscriptionService.DestroySubscriptions(this.subscription); //Muss an dieser Stelle zerstört werden
      })
    })
    )
  }

  createTrainee() {
    this.traineeObj.homeFacility.name = this.selectedFacility.Name; //für das Trainee-Objekt...
    this.authService.SignUpTrainees(this.traineeObj.email, "hund111", this.traineeObj).then(() => {
      this.fireStoreService.updateUsedCapacity(this.collectionService.facilityCollection, this.selectedFacility)
      this.refreshDialog();
    })
  }

  refreshDialog(){
    this.subscriptionService.DestroySubscriptions(this.subscription);
    this.selectedFacility = undefined;
    this.traineeObj.name = "";
    this.traineeObj.firstName = "";
    this.traineeObj.email = "";
    this.traineeObj.homeFacility.name = "";
    this.facilityCollection = undefined;
    this.convertingArray.length = 0;
    this.dialogfacilityArray.length = 0;
    this.ngOnInit();
  }

}
