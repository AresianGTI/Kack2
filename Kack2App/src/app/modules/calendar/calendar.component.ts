import {
  Component, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
  Directive,
  ElementRef,
  Input
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

export type AuthGroup = 'VIEW_ONLY' | 'UPDATE_FULL' | 'CREATE';
// @Injectable()
@Directive({
  selector: '[myHideIfUnauthorized]'
})
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
  @Input('myHideIfUnauthorized') permission!: AuthGroup; 
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  constructor(private modal: NgbModal,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    public authService: AuthService,
    private el: ElementRef) { }
  ngOnDestroy(): void {
    this.authService.getValue().subscribe().unsubscribe();
  }
  isVisible = false;
  ngOnInit(): void {

    this.calendarService.events =[];
    this.calendarService.ownEvents =  [];
    this.authService.getValue().subscribe((value) =>{
      if(value){
        this.calendarService.loadEvents(value.role);
      }
      if(value.role == "coordinator")
      {
        this.isVisible = true;
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

  handleEvent(action: string, event: any): void {
    
    if (event.sender.id == this.authService.userData.ID) {
    this.calendarService.modalData = { event, action };
    // console.log("was diesse kake lan: ", this.calendarService.modalData)
    this.openDialog("Update", event)
    // this.calendarService.deleteSingleEvent(event);
    this.modal.open(this.modalContent, { size: 'lg'});
    }
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

  openDialog(action: any, obj?: { action?: any; }) {
    


    if (action == "Update") {
      this.dialog.open(CalendarDialogComponent, {data: obj});
    }
    else if (action == "Create") {
      this.dialog.open(CalendarDialogComponent, {data: action});
    }
    // else if (action == "Delete") {
    //   let dialogRef: any;
    //   obj!.action = action;
    //   dialogRef = this.dialog.open(DialogBoxComponent, { data: obj });
    //   dialogRef.afterClosed()
    //     .subscribe((result: { event: string; data: any; }) => {
    //       this.firestoreService.deleteDocument(
    //         result.data, "facilities")
    //     });
    // }
  }
  // ChooseDialog(action: any, obj?: { action?: any; }) {
  //   let dialogRef: any;
  //   let data;
  //   if (obj!) {
  //     obj!.action = action;
  //     data = obj;
  //   }
  //   else {
  //     data = action;
  //   }
  //   switch (this.tab_selection) {
  //     case ("Einrichtung"): {
  //       dialogRef = this.dialog.open(FacilityDialogComponent, { data: data });
  //       break;
  //     }
  //     case ("Auszubildender"): {
  //       dialogRef = this.dialog.open(TraineeDialogComponent, { data: data });
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }
}
