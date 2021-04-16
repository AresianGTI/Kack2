import { Injectable } from '@angular/core';
import { startOfDay, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { EnumMeetingTypes } from '../enums/enums.service';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
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
    public authService: AuthService,
    public afs: AngularFirestore) {
  }
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData!: {
    action: string;
    event: any;
  };
  date = new FormControl(new Date());
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  ownEvents: CalendarEvent[] = [];
  existingRoleEvents: CalendarEvent[] = [];
  newEvents: any[] = [];
  public traineesInFacility: any[] = [];

  predefinedEvents(type: string, color: any) {
    let event: any = {
      id: this.firestoreService.createID(),
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      title: type,
      color: color,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    return event;
  }

  traineeEvents: CalendarEvent[] = [
    this.predefinedEvents(EnumMeetingTypes.applyVacation, colors.red),
    this.predefinedEvents(EnumMeetingTypes.notificationOfIlness, colors.green)
  ];
  coordinatorEvents: CalendarEvent[] = [
    this.predefinedEvents(EnumMeetingTypes.practicalMeeting, colors.blue),
    this.predefinedEvents(EnumMeetingTypes.singleMeeting, colors.yellow)
  ]
  safeNewEvent() {
    this.ownEvents = [
      ...this.ownEvents,
      ...this.newEvents
    ];
    this.newEvents.filter((event) => {
      if (event.title != "") {
        this.setEventData(event);
      } else {
        this.deleteEvent(event);
      }
    })
    this.newEvents = [];
  }
  addEvent(): void {
    this.newEvents = [...this.newEvents,
    this.predefinedEvents("", colors.black)];
  }


  addOwnEvents(event: any) {
    event.start = new Date(event.start.seconds * 1000);
    event.end = new Date(event.end.seconds * 1000);
    this.ownEvents = [
      ...this.ownEvents,
      event
    ];

  }
  addEventTest(event: any) {
    event.start = new Date(event.start.seconds * 1000);
    event.end = new Date(event.end.seconds * 1000);
    this.events = [
      ...this.events,
      event
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    // this.ownEvents.filter((event) => this.firestoreService.deleteDocument(event, "Test"));
    this.ownEvents = this.ownEvents.filter((event) => event !== eventToDelete);
    this.events = this.ownEvents;
  }

  firestoreDocument: any = {
    UID: "",
    items: {
    }
  }

  setEventData(event: any) {
    let id = this.firestoreService.createID();
    this.firestoreDocument.UID = this.authService.userData?.ID;
    this.firestoreDocument.Name = this.authService.userData?.name;
    this.firestoreDocument.items = this.ownEvents;
    this.firestoreService.updateDocument("Test", this.firestoreDocument);
    this.events = this.ownEvents;
  }
  loadEvents(action: string) {
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToOwnEventList(val)
    });
    this.getTrainees();
  }
  addElementsToOwnEventList(val: any) {
    val.forEach((element: any) => {
      this.addOwnEvents(element[1]);
    });
    this.events = this.ownEvents
    this.refresh.next();
  }
  addElementsToEventList(val: any) {
    val.forEach((element: any) => {
      this.addEventTest(element[1]);
    });
    this.refresh.next();
  }

  getTrainees() {
    this.events = [];
    this.firestoreService.getTraineesInFacility(this.authService.userData).then((val) => {
      this.traineesInFacility = val;
    })
  }
  getTraineeEvents(trainee: any) {
    this.events = [];
    this.firestoreService.mapUserDataToObject(trainee, "Test", "items").then((val) => {
      this.addElementsToEventList(val)
    });
  }
  getOwnData() {
    this.ownEvents = [];
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToOwnEventList(val)
    });
  }
  getAllEventsFromAllUser() {
    this.getTraineeEvents(this.authService.userData)
    this.getTrainees();
    this.traineesInFacility.forEach((element: any) => {
      this.firestoreService.getAllCollectionItems(element, "Test", "items").then((arr) => {
        if (arr) {
          this.addElementsToEventList(arr);
        }
      });
    })
  }
}