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

   actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.calendarService.events = this.calendarService.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
test: string = "";
// guard : boolean = false;
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
      if(value){
        console.log("Ich bin der User im Kalender:", value);
        this.calendarService.loadEvents(value.role);
      }
     
    })
    console.log("OnInit CalenderComponent");
  }
  // getGuard():boolean{
  //   return this.guard;
  // }

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
    console.log("was diesse kake lan: ", this.calendarService.modalData)
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
