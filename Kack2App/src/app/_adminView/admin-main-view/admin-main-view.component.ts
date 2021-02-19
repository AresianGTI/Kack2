import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacilityDialogComponent } from '../facility-dialog/facility-dialog.component';


export interface PeriodicElement {
  name: string;
  position: number;
  adress: string;
  facility_area: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Krankenhaus Kirchheim', facility_area: "KS", adress: 'Ling' },
  { position: 2, name: 'Psychatrie Kirchheim', facility_area: "HS", adress: 'Long' },
  { position: 3, name: 'Huansohn', facility_area: "Karl_ess", adress: 'Taschang' },
];


@Component({
  selector: 'app-admin-main-view',
  templateUrl: './admin-main-view.component.html',
  styleUrls: ['./admin-main-view.component.scss']
})
export class AdminMainViewComponent implements OnInit {

  displayedColumns: string[] = ['Position', 'Name', 'Einrichtungsart', 'Adresse'];
  dataSource = ELEMENT_DATA;

  constructor(private router: Router, public dialog: MatDialog ){}

  onBtnClick() {
    this.router.navigate(["/facility-dialog"]);
  }

  openDialog() {
    const dialogRef = this.dialog.open(FacilityDialogComponent);  //Einrichtungsdialog wird geöffnet

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngOnInit() {

  }




}
