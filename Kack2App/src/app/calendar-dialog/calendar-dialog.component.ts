import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from '../services/calendar/calendar.service';
import { AuthService } from '../core/auth.service';
import { FirestoreService } from '../services/firestore/firestore.service';

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
    
    // this.firestoreService.getUserData(this.authService.userData)
    console.log("Ich bin der User im Kalender:", this.authService.userData);
    if (this.authService.userData.role == "coordinator") {
      this.calendarService.eventsTest = this.calendarService.coordinatorEvents;
    }
    else if (this.authService.userData.role == "trainee") {
      this.calendarService.eventsTest = this.calendarService.traineeEvents;
    }
    // this.calendarService.addEvent();
  }
  
  getEventData(event: any, evento: any) {
    event.color = evento.color
  }

}