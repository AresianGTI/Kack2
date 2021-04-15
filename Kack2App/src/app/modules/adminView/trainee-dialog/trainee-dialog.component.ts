import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Trainee } from 'src/app/models/user';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { SubscriptionCollectionService } from 'src/app/services/subscription-collection.service';
import { Subscription } from 'rxjs';
import { Facility, FacilityType, IFacility } from 'src/app/models/facility';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-trainee-dialog',
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent implements OnInit, OnDestroy {

  traineeObj: Trainee = new Trainee();
  dialogfacilityArray: IFacility[] = [];
  selectedFacility!: IFacility | undefined;
  facilityCollection!: any; //Google Object
  convertingArray: any;     //for mapping Firebase-Collection into Array
  subscription: Subscription[] = [];

  action: string;
  local_data: any;

  constructor(
    public fireStoreService: FirestoreService,
    public authService: AuthService,
    public collectionService: CollectionsService,
    public subscriptionService: SubscriptionCollectionService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if (typeof (data) === "string") {
        this.action = data;
      }
      else {
        this.local_data = { ...data };
        this.action = this.local_data.action;
      }
  
    }

  ngOnDestroy(): void {
    this.subscriptionService.DestroySubscriptions(this.subscription);
  }

  ngOnInit(): void {
    this.getFacilitySelection();
    //load data for editing the trainee
    if (this.local_data) {
      this.traineeObj.ID = this.local_data.ID;
      this.traineeObj.name = this.local_data.name;
      this.traineeObj.firstName = this.local_data.firstName;
      this.traineeObj.homeFacility.name = this.local_data.homeFacility;
      this.traineeObj.email = this.local_data.email;
    }
  }

  getFacilitySelection(){
    this.facilityCollection = this.fireStoreService.getAllFacilities(CollectionsService.facilityCollection);
    const facilityObservableArray = this.facilityCollection.valueChanges();

    this.subscription.push(facilityObservableArray.subscribe((facility: any) => {  //converting in array
      this.convertingArray = facility;
      this.convertingArray.forEach((fclty: any) => {
        this.dialogfacilityArray.push(fclty);
        this.subscriptionService.DestroySubscriptions(this.subscription);
      })
    })
    )
  }

  createOrUpdate() {
    if (this.action == "Update") {
      this.fireStoreService.updateTraineeCollection(CollectionsService.userCollection, this.traineeObj)
    }
    else if (this.action == "Create") {
      this.createTrainee();
    }
  }

  createTrainee() {
    if(this.selectedFacility)
    this.traineeObj.homeFacility.name = this.selectedFacility.name; //set homeFacility for the trainee
    
    this.authService.SignUpTrainees(this.traineeObj.email, "hund111", this.traineeObj).then(() => {
      this.fireStoreService.updateUsedCapacity(CollectionsService.facilityCollection, this.selectedFacility)
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
