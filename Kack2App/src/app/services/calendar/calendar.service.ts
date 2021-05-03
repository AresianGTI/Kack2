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
import { async } from '@angular/core/testing';
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
  public coordinatorsInFacility: any[] = [];


  predefinedEvents(type: string, color: any, receiver?: any) {

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
      sender: this.authService.userData.ID,
      // receiver für Azubis nicht relevant
      receiver: receiver
    }
    return event;
  }
  traineeEvents: CalendarEvent[] = []
  coordinatorEvents: CalendarEvent[] = []
  setEvents() {
    this.traineeEvents = [
      this.predefinedEvents(EnumMeetingTypes.applyVacation, colors.red),
      this.predefinedEvents(EnumMeetingTypes.notificationOfIlness, colors.green)
    ];
    this.coordinatorEvents = [
      this.predefinedEvents(EnumMeetingTypes.practicalMeeting, colors.blue),
      this.predefinedEvents(EnumMeetingTypes.singleMeeting, colors.yellow)
    ]
  }

  safeNewEvent() {
    let evo: any[] = []
    this.ownEvents = [
      ...this.ownEvents,
      ...this.newEvents
    ];
    console.log("DAS SIND DIE NewEvents DIE GESPEICHERT WERDEN: ", this.newEvents)
    this.newEvents.filter((event) => {
      if (event.title != "") {
        // if(this.eventReceiver.length != 0){
        //   event.receiver = this.eventReceiver;
        //   this.setEventData(this.ownEvents, this.authService.userData);
        //   this.eventReceiver = []
        // }
        if (event.receiver) {

          event.receiver.forEach((user: any) => {
            // evo = [...evo, event];
            // DER RETURNWERT kommt zu spät --> Deswehen geht er in die Methode rein
            // if (this.getEventData(event, element)) {
            //   this.updateEventData([event], element)
            // }

            // else {
            //   this.setEventData(event, element);

            // }
            // this.firestoreService.getData(user).then((val) => {


            // })
                  // this.updateEventData([event], element)
            this.getEventData(event, element)
            // this.setEventData([event], user)
          });
        }
      } else {

        this.deleteEvent(event);
      }

    })
    this.setEventData(this.ownEvents, this.authService.userData);


    console.log("DAS SIND DIE ÈVNETS DIE GESPEICHERT WERDEN: ", this.newEvents)
    this.firestoreEnty = [];
    this.eventReceiver = []
    this.newEvents = [];
  }

  addEvent(): void {
    let receiver: any[] = []
    if (this.authService.userData.role == "coordinator") {
      receiver = this.traineesInFacility;
    }
    else if (this.authService.userData.role == "trainee") {
      receiver = this.coordinatorsInFacility;
    }
    let ev = this.predefinedEvents("", colors.black, receiver);
    this.newEvents = [...this.newEvents, ev];
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

  deleteEvent(eventToDelete: any) {
    this.newEvents = this.newEvents.filter((event) => event !== eventToDelete)
  }
  async deleteSingleEvent(eventToDelete: any) {
    let counter = 0;
    if (eventToDelete.sender == this.authService.userData.ID) {

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
        });
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
  //PROBLEMFUNKTION --> Funktion wird erst später ausgeführt.
  getEventData(event: any, user: any): Promise<any> {
    let t: any;
    return this.firestoreService.getData(user).then((val) => {
      if (val) {
        t = val
        this.firestoreEnty.push(val);
      }
      else {
        this.setEventData([event], user);
        this.getEventData(event, user);
      }
    })

  }
  updateEventData(ding: any, user?: any) {
    let t: any = []
    this.firestoreEnty.forEach((element: any) => {
      this.firestoreDocument.UID = user?.ID;
      this.firestoreDocument.Name = user?.name;
      element.items.push(ding);
      this.firestoreDocument.items = element.items;
      this.firestoreService.updateDocument("Test", this.firestoreDocument);
      this.firestoreEnty = []
      this.events = this.ownEvents;

    });

  }

  // setFirstData(ding: any[], user?: any) {
  //   this.firestoreDocument.UID = user?.ID;
  //   this.firestoreDocument.Name = user?.name;
  //   // this.firestoreDocument.items = [ding];
  //   this.firestoreDocument.items = ding;
  //   this.firestoreService.updateDocument("Test", this.firestoreDocument);
  //   this.events = this.ownEvents;
  //   console.log("setFirstData: ", this.events)
  // }
  setEventData(eve: any[], user?: any) {


    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;

    // this.firestoreDocument.items.push(eve);
    this.firestoreDocument.items = eve;
    this.firestoreService.updateDocument("Test", this.firestoreDocument);
    this.events = this.ownEvents;


  }
  loadEvents(action: string) {
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToOwnEventList(val)
    })
    this.getTrainees();
    this.getCoordinators();
    this.setEvents();
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
  getCoordinators() {
    this.firestoreService.getCoordinatorsInFacility(this.authService.userData).then((val) => {
      this.coordinatorsInFacility = val;
    })
  }
  getTrainees() {
    this.events = [];
    this.firestoreService.getTraineesInFacility(this.authService.userData).then((val) => {
      this.traineesInFacility = val;
    })
  }

  getTraineeEvents(trainee: any) {
    this.events = [];
    return this.firestoreService.mapUserDataToObject(trainee, "Test", "items").then((val) => {
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