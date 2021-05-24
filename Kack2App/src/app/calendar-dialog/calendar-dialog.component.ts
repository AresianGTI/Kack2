import { Component, Inject, OnInit, Optional } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  test: any;
  action: string;
  local_data: any;
  isVisibile = false;

  constructor(private modal: NgbModal,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    public authService: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    calendarService.newEvents = [];
    if (typeof (data) === "string") {
      this.action = data;
    }
    else {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      this.calendarService.newEvents.push(this.local_data);
    }
  }
  ngOnInit(): void {
    if (this.authService.userData.role == "coordinator") {
      this.calendarService.existingRoleEvents = this.calendarService.coordinatorEvents;
      this.isVisibile = true;
    }
    else if (this.authService.userData.role == "trainee") {
      this.calendarService.existingRoleEvents = this.calendarService.traineeEvents;
    }
  }
  sendEventToTrainee(event: any) {
    this.dialog.open(CalendarAddTraineesDialogComponent, { data: event })
      .afterClosed().subscribe((result: { data: any }) => {
        event.receiver = result.data.receiver;
      })
  }
  getEventData(event: any, evento: any) {
    event.color = evento.color
    event.title = evento.title
  }
}