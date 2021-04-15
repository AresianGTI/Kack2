//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { EnumRoles } from 'src/app/services/enums/enums.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { AdminMainViewComponent } from '../adminView/admin-main-view/admin-main-view.component';

export interface UsersData {
  name: string;
  id: number;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})



export class DialogBoxComponent {

  dialogContent: string;
  action: string;
  local_data:any;
  constructor(
    
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public firestoreService: FirestoreService ) {
    newFunction(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
    this.dialogContent = this.local_data.dialogContent;
  }

  doAction()
  {
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog()
  {
    this.dialogRef.close({event:'Cancel'});
  }

  deleteAll(){
    switch (this.local_data.selectedTab) {
      case 'Einrichtung': {
        this.firestoreService.deleteAllFacilities(CollectionsService.facilityCollection, CollectionsService.userCollection);
        // this.facilityContent = undefined; // muss anders geleert werden
        break;
      }
      case 'Auszubildender': {
        this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.trainee);
        break;
      }
      case 'Koordinatoren': {
        // this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.coordinator);
        break;
      }
      case 'Traeger': {
        // this.firestoreService.deleteAllUserWithDesiredRole(CollectionsService.userCollection, EnumRoles.teacher);
        break;
      }
      default: {
        alert('Something went wrong. :/ ');
        break;
      }
    }
  }

}

function newFunction(data: any) {
  console.log(data);
}
