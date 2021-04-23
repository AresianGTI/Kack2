import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CalendarService } from '../services/calendar/calendar.service';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-calendar-add-trainees-dialog',
  templateUrl: './calendar-add-trainees-dialog.component.html',
  styleUrls: ['./calendar-add-trainees-dialog.component.scss']
})
export class CalendarAddTraineesDialogComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  // displayedColumnsTrainee: string[] = ['name', 'firstName', 'homeFacility'];
  displayedColumns: string[] = ['select', 'name', 'firstName', 'homeFacility'];
  dataSource = new MatTableDataSource<any>(this.calendarService.traineesInFacility)
  constructor( public calendarService: CalendarService,
    public firestoreService: FirestoreService) { 
  }
  selectedValues: any [] =[];
  ngOnInit(): void {

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => {
          this.selection.select(row)
        });
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  getSelectedTrainees(){
    this.dataSource.data.forEach(row => {
      if(this.selection.isSelected(row))
      {
        // this.firestoreService.getFieldsFromCollection()
        this.calendarService.eventReceiver.push(row);
        console.log("selected Row", row)
      }
    })
  }
}
