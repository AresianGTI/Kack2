import {
  Component, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDialogComponent } from 'src/app/calendar-dialog/calendar-dialog.component';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { AuthService } from 'src/app/core/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { switchMap } from 'rxjs/operators';

// @Injectable()
@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    public authService: AuthService) {
      console.log("Constructor Calendar Component");
      
    

     }
  ngOnDestroy(): void {
    this.authService.getValue().subscribe().unsubscribe();
  }
  ngOnInit(): void {
    this.authService.getValue().subscribe((value) =>{
      if (value.role == "coordinator") {
        console.log("Coordinator-Status");
        this.calendarService.dataMata();
        this.calendarService.getAllCalendarData("Test");
      }
      else if (value.role == "trainee") {
        console.log("Trainee-Status");
        // this.calendarService.getUserData(value);
        this.calendarService.dataMata();
      }
    })
    console.log("OnInit CalenderComponent");

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.calendarService.events = this.calendarService.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.calendarService.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  openDialog() {
    this.dialog.open(CalendarDialogComponent);
  }

}
