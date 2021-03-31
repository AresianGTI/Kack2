import {
  Injectable
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { EnumMeetingTypes } from '../enums/enums.service';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from 'src/app/core/auth.service';
const colors: any = {
  red: {
    primary: '#ad2121',
  },
  blue: {
    primary: '#1e90ff',
  },
  yellow: {
    primary: '#e3bc08',
  },
  green: {
    primary: '#90ee90',
  },
  black: {
    primary: '#000000'
  }
};
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    public dialog: MatDialog,
    public firestoreService: FirestoreService,
    public authService: AuthService) { }
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  eventData(type: string, color: any) {
    let menmen: any = {
      UID: this.authService.userData?.ID,
      ID: this.firestoreService.createID(),
      // start: subDays(startOfDay(new Date(),1),
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      // end: addDays(new Date(),1),
      title: type,
      color: color,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    return menmen;
  }
  traineeEvents: CalendarEvent[] = [
    this.eventData(EnumMeetingTypes.applyVacation, colors.red),
    this.eventData(EnumMeetingTypes.notificationOfIlness, colors.green)
  ];

  coordinatorEvents: CalendarEvent[] = [
    this.eventData(EnumMeetingTypes.practicalMeeting, colors.blue),
    this.eventData(EnumMeetingTypes.singleMeeting, colors.yellow)
  ]
  eventsTest: CalendarEvent[] = [
  ];

  safeNewEvent() {
    this.events.filter((event) => {
      if (event.title != "") {
        this.firestoreService.createDocument("CalendarMeetings", event);


      } else {
        alert("testoMets");
        this.deleteEvent(event);
      }
    })
  }
  addEvent(): void {
    this.events = [
      ...this.events,
      this.eventData("", colors.black)
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events.filter((event) => this.firestoreService.deleteDocument(event, "CalendarMeetings"));
    this.events = this.events.filter((event) => event !== eventToDelete);
  }


  testData() {
    let menmen: any = {
      UID: this.authService.userData?.ID,
      item:{
        ID: this.firestoreService.createID(),
        // start: subDays(startOfDay(new Date(),1),
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        // end: addDays(new Date(),1),
        title: "type",
        color: colors.black,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      }
     
    }
    console.log("MENMEN: ", menmen);
    // this.firestoreService.updateDocument("Test", menmen);
    let stabil  = [
    menmen ]
    stabil.push(menmen);
    stabil = [...stabil, menmen]
    console.log("Stabil: ", stabil);
  
      this.firestoreService.updateDocument("Test",   this.gggg(stabil));
    return menmen;
  }
  gggg(stabil: Array<any>): Array<any>{
    let js = {
      ff:22,
      sss:1
    }
     return stabil = [...stabil, js ]
  }
}
