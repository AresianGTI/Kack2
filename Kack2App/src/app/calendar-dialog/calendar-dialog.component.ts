import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from '../services/calendar/calendar.service';
import { AuthService } from '../core/auth.service';
import { FirestoreService } from '../services/firestore/firestore.service';
import { CalendarAddTraineesDialogComponent } from '../calendar-add-trainees-dialog/calendar-add-trainees-dialog.component';

// @Injectable()
@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent implements OnInit {

  
  constructor(private modal: NgbModal,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    public authService: AuthService) { }
  ngOnInit(): void {
    // this.calendarService.events = [] ;
    // this.calendarService.ownEvents = [] ;
    // this.firestoreService.getUserData(this.authService.userData)
    console.log("Ich bin der User im Kalender:", this.authService.userData);
    if (this.authService.userData.role == "coordinator") {
      this.calendarService.existingRoleEvents = this.calendarService.coordinatorEvents;
      
    }
    else if (this.authService.userData.role == "trainee") {
      this.calendarService.existingRoleEvents = this.calendarService.traineeEvents;
      // this.calendarService.events = this.calendarService.ownEvents;
    }
    // this.calendarService.getOwnData();
    console.log("OWN Events in OnInit: ", this.calendarService.ownEvents)
    // this.calendarService.addEvent();
  }
  sendEventToTrainee(){
    this.dialog.open(CalendarAddTraineesDialogComponent);
  }
  getEventData(event: any, evento: any) {
    event.color = evento.color
    event.title = evento.title
  }
}