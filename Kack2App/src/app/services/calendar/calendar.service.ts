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
import { element } from 'protractor';
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
      },
      sender: this.authService.userData,
      // receiver für Azubis nicht relevant
      receiver: this.eventReceiver
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
        if (event.receiver) {

          event.receiver.forEach((element: any) => {

            this.events = [...this.events, event];
            if (this.getEventData(event, element)) {
              this.updateEventData(event, element)
            }
            else {
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
  }
  addEventTest(event: any) {
    event.start = new Date(event.start.seconds * 1000);
    event.end = new Date(event.end.seconds * 1000);
    this.events = [
      ...this.events,
      event
    ];

  }
  deleteAllEvents() {
    this.firestoreService.deleteDocument(this.authService.userData, "Test")
    this.refresh.next()
    this.events = []
  }
  async deleteSingleEvent(eventToDelete: any) {
    let fug: any[] = [];
    let del: any[] = [];
    let counter = 0;
    if (eventToDelete.sender.ID == this.authService.userData.ID) {
      
      eventToDelete.receiver.forEach((user: any) => {
        this.firestoreService.getData(user).then((val) => {
          let d: any[] = []
          val.items.forEach((item: any) => {
            if (item.id != eventToDelete.id) {
              d.push(item);
            }
            counter++;
          });
          this.firestoreService.deleteFieldValue("Test", val, d)
          console.log("ITEEEEM: ", d)
          console.log("Value: ", val)
        });
        console.log("USER: ", user)
      });

        this.firestoreService.getData(this.authService.userData).then((val) => {
          let d: any[] = []
          val.items.forEach((item: any) => {
            if (item.id != eventToDelete.id) {
              d.push(item);
            }
            counter++;
          });
          this.firestoreService.deleteFieldValue("Test", val, d)
          this.getOwnData();
        });


      // this.ownEvents = this.ownEvents.filter((event) => event !== eventToDelete);
      // this.setEventData(this.ownEvents, this.authService.userData)
      // let t = await this.firestoreService.getFieldsFromCollectionTT("Test", "items")
      // console.log("Return T: ", t);
      // t.forEach((element: any) => {
      //   //     this.ownEvents = this.ownEvents.filter((event) => event !== eventToDelete);
      //   // this.setEventData(this.ownEvents, this.authService.userData)
      //   element.forEach((elem: any) => {
      //     console.log("eventtodelet: ", eventToDelete.id)
      //     console.log("eventID: ", elem.id)
      //     if (elem.id == eventToDelete.id) {
      //       fug.push(elem)
      //     }
      //     console.log("Elem: ", elem)
      //   });
      //   console.log("Fug: ", fug)
      //   //  Lösche alle Events in fug
      //   //  fug.filter((event) => event !== eventToDelete
      //   //  );
      // });

      // this.setEventData(this.ownEvents, this.authService.userData)
      //alle Events mit der Selben EventID werden gelöscht-->
      //getAll Dokumente in der Collection
      //foreach item in items
      //if item.id == eventToDelete.ID && item.sender == authService.userData.ID
      //Dann lösche Item --> items.filter(item => item !=eventToDelet) -->
      //updateFireStore des betroffenen Trainees mit neuem FirestoreDocument (entferne somit das Event)
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
  getEventData(event: any, user: any): boolean {
    try {
      this.firestoreService.getData(user).then((val) => {
        if (val) {
          this.firestoreEnty.push(val);
        }
        else {
          this.setFirstData(event, user);
          this.getEventData(event, user);
        }
      });
      return true;
    } catch {
      console.log("Keine Dokument vorhanden")
      return false
    }
  }
  updateEventData(ding: any, user?: any) {
    this.firestoreEnty.forEach((element: { items: any; }) => {
      this.firestoreDocument.UID = user?.ID;
      this.firestoreDocument.Name = user?.name;
      element.items.push(ding);
      this.firestoreDocument.items = element.items;
      this.firestoreService.updateDocument("Test", this.firestoreDocument);
      this.events = this.ownEvents;
    });
    this.firestoreEnty = []
  }

  setFirstData(ding: any, user?: any) {
    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;
    this.firestoreDocument.items = [ding];
    this.firestoreService.updateDocument("Test", this.firestoreDocument);
    this.events = this.ownEvents;
  }
  setEventData(eve: any, user?: any) {
    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;
    this.firestoreDocument.items = eve;
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