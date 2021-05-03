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
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDialogComponent } from 'src/app/calendar-dialog/calendar-dialog.component';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { AuthService } from 'src/app/core/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { switchMap } from 'rxjs/operators';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

// @Injectable()
@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
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
      // this.calendarService.getTrainees();
      // this.calendarService.getCoordinators();
     }
  ngOnDestroy(): void {
    this.authService.getValue().subscribe().unsubscribe();
  }
  ngOnInit(): void {
    this.calendarService.events =[];
    this.calendarService.ownEvents =  [];
    this.authService.getValue().subscribe((value) =>{
      if(value){
        this.calendarService.loadEvents(value.role);
       
        // this.calendarService.setEvents();
      }
    })
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
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.calendarService.modalData = { event, action };
    // console.log("was diesse kake lan: ", this.calendarService.modalData)
    this.calendarService.deleteSingleEvent(event);
    this.modal.open(this.modalContent, { size: 'lg'});
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
