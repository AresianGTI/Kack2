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
import { Trainee } from 'src/app/models/trainee';
import { Console } from 'node:console';
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
  testEvent: any = [];

  eventFromCoordinator: CalendarEvent[] = [];
  eventReceiver: Trainee[] = [];
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

    this.setEventData(this.ownEvents, this.authService.userData);

    this.newEvents.filter((event) => {


      if (event.title != "") {
        if (this.eventReceiver) {

          this.eventReceiver.forEach(element => {
            // this.getTraineeEvents(element);
            // console.log("ElementReceiver: ", element)
            this.events = [...this.events, event];
            if(this.getEventData(event, element))
            {
              console.log("if");
              this.updateEventData(event, element)
            }
            else {
              console.log("else");
              this.setEventData(this.events, element);
            }
          });
        }
      } else {
        this.deleteSingleEvent(event);
      }
    })
    this.firestoreEnty = [];
    this.eventReceiver = []
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
    // console.log("OWNEVENT: ", event)

  }
  addEventTest(event: any) {
    // console.log("EVENT1: ", event)
    event.start = new Date(event.start.seconds * 1000);
    event.end = new Date(event.end.seconds * 1000);
    this.events = [
      ...this.events,
      event
    ];
    // console.log("EVENT2: ", event.start)

  }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.ownEvents = this.ownEvents.filter((event) => event !== eventToDelete);
  //   this.refresh.next();
  //   this.events = this.ownEvents;
  //   this.setEventData();
  // }
  deleteAllEvents() {
    this.firestoreService.deleteDocument(this.authService.userData, "Test")
    this.refresh.next()
    this.events = []
  }
  deleteSingleEvent(eventToDelete: any) {

    if (this.ownEvents.indexOf(eventToDelete) !== -1) {
      this.ownEvents = this.ownEvents.filter((event) => event !== eventToDelete);
      this.setEventData(this.ownEvents, this.authService.userData)
      //darf nicht von own events sein --> für jeden User der müssen seine Events geladen 
      // werden und hinzufgegüt werden
      // FireStoreDocument.receiver = []
      // FireStoreDocument.sender = authService.userData. UID 
    }
    else {
      console.log("nichts gibts");
    }

  }
  firestoreDocument: any = {
    UID: "",
    items: {
    }
  }
  firestoreEnty: any[] = [];
  getEventData(event: any, user: any) : boolean{
    try {
      this.firestoreService.getData(user).then((val) => {
        if (val) {
          console.log("Dokument von: ", val)
          this.firestoreEnty.push(val);
          // this.events = val.items;

          console.log("Items von: ", this.firestoreEnty)
          // return true;
        }
        else {
          this.setFirstData(event, user);
          this.getEventData(event, user);
        }
      });
      return true;
      // this.firestoreEnty = [];
    } catch {
      console.log("Keine Dokument vorhanden")
      return false
    }


  }
  updateEventData(ding: any, user?: any) {
    console.log("sssssss: ", this.firestoreDocument)
    console.log("enty: ", this.firestoreEnty)
    this.firestoreEnty.forEach((element: { items: any; }) => {
      this.firestoreDocument.UID = user?.ID;
      this.firestoreDocument.Name = user?.name;
    
      element.items.push(ding);
      this.firestoreDocument.items = element.items;
      console.log("items: ", element.items)
      this.firestoreService.updateDocument("Test", this.firestoreDocument);
      this.events = this.ownEvents;
      console.log("firedoc: ", this.firestoreDocument)
    });
    this.firestoreEnty = []
  }

  setFirstData(ding: any, user?: any) {
    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;
    console.log("SetFirstData", ding);
    this.firestoreDocument.items = [ding];

    // console.log("Eve: ", eve)

    // this.firestoreDocument.otherItems = this.eventFromCoordinator;
    this.firestoreService.updateDocument("Test", this.firestoreDocument);
    this.events = this.ownEvents;
  }
  setEventData(eve: any, user?: any) {
    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;
    this.firestoreDocument.items = eve;

    console.log("SetEventData: ", eve)
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
      console.log("LOG ELEMENT: ", element[1]);
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

  //Die brauch ich !
  getTraineeEvents(trainee: any) {
    this.events = [];
    this.firestoreService.mapUserDataToObject(trainee, "Test", "items").then((val) => {
      console.log("valueeeeey: ", val)
      this.addElementsToEventList(val)
    }).then(() => {
      console.log("eventsFrom Trainee: ", trainee.name, this.events);
    });
  }
  sendEventToTrainee() {

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