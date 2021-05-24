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
import { ThisReceiver } from '@angular/compiler';
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
  existingRoleEvents: CalendarEvent[] = [];
  newEvents: any[] = [];
  public traineesInFacility: any[] = [];
  public coordinatorsInFacility: any[] = [];

  traineeEvents: CalendarEvent[] = []
  coordinatorEvents: CalendarEvent[] = []
  allEventTypes: any[] = []
  predefinedEvents(type: string, color: any) {
    let receiver: any[] = []
    if (this.authService.userData.role == "coordinator") {
      receiver = this.traineesInFacility;
    }
    else if (this.authService.userData.role == "trainee") {
      receiver = this.coordinatorsInFacility;
    }
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
      sender: {
        id: this.authService.userData.ID,
        name: this.authService.userData.name
      },
      // receiver für Azubis nicht relevant
      receiver: receiver
    }
    return event;
  }

  setEvents() {
    this.traineeEvents = [
      this.predefinedEvents(EnumMeetingTypes.applyVacation, colors.red),
      this.predefinedEvents(EnumMeetingTypes.notificationOfIlness, colors.green)
    ];
    this.coordinatorEvents = [
      this.predefinedEvents(EnumMeetingTypes.practicalMeeting, colors.blue),
      this.predefinedEvents(EnumMeetingTypes.singleMeeting, colors.yellow)
    ]
    this.allEventTypes = [...this.traineeEvents, ...this.coordinatorEvents]

  }

  deleteEvent(eventToDelete: any) {
    this.newEvents = this.newEvents.filter((event) => event !== eventToDelete)
  }
  async updateEvent(event: any) {
    if (event.sender.id == this.authService.userData.ID) {
      for (const user of event.receiver) {
        await this.firestoreService.getData(user).then(async (val) => {
          if (val) {
            let items: any[] = []
            val.items.forEach((item: any) => {

              if (item.id == event.id) {
                item = event;
              }
              items.push(item)
            });
            this.setEventData(items, user)

          }
        })
      }
    }
  }

  async safeNewEvent(action: string) {
    this.newEvents = this.newEvents.filter((event) => event.title !== "")
    this.ownEvents = [
      ...this.ownEvents,
      ...this.newEvents
    ];
    this.setEventData(this.ownEvents, this.authService.userData);
    this.refresh.next();
    for (const event of this.newEvents) {
      if (event.title != "") {
        if (event.receiver) {
          this.events = [...this.events, event];
          for (const user of event.receiver) {

            await this.firestoreService.getData(user).then(async (val) => {
              if (val) {
                let items = [];
                items = [...val.items, event]
                this.setEventData(items, user)
              }
              else {
                await this.firestoreService.getData(user).then((vall) => {
                  if (vall) {
                    let items = [];
                    items = [...vall.items, event]
                    this.setEventData(items, user)
                  }
                  else {
                    this.setEventData([event], user);
                  }
                })
              }
            })
          }
        }
      } else {
        this.deleteEvent(event);
      }
    }
    this.events = this.ownEvents;
    this.refresh.next();
    this.newEvents = [];
  }
  
  addEvent(): void {
    let ev = this.predefinedEvents("", colors.black);
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
  async deleteSingleEvent(eventToDelete: any) {
    if (eventToDelete.sender.id == this.authService.userData.ID) {

      eventToDelete.receiver.forEach((user: any) => {
        this.firestoreService.getData(user).then((val) => {
          let d: any[] = []
          val.items.forEach((item: any) => {
            if (item.id != eventToDelete.id) {
              d.push(item);
            }
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
        });
        this.firestoreService.deleteFieldValue("Test", val, d)
        this.getOwnData();
      });
      this.deleteEvent(eventToDelete);
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
  // getEventData(event: any, user: any) {
  //   this.firestoreService.getData(user).then((val) => {
  //     console.log("VALUE: ", val)
  //   })
  // }

  setEventData(eve: any[], user?: any) {
    this.firestoreDocument.UID = user?.ID;
    this.firestoreDocument.Name = user?.name;
    this.firestoreDocument.items = eve;
    this.firestoreService.updateDocument("Test", this.firestoreDocument);
  }
  loadEvents(action: string) {
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToOwnEventList(val)
    });
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
  addAllEventsFromType(val: any, eventType: any) {
    val.forEach((element: any) => {
      if (element[1].title == eventType.title) {
        this.addOwnEvents(element[1]);
      }
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
    this.firestoreService.getUserInFacility(this.authService.userData, "coordinators").then((val) => {
      this.coordinatorsInFacility = val;
    })
  }
  getTrainees() {
    this.events = [];
    this.firestoreService.getUserInFacility(this.authService.userData, "trainee").then((val) => {
      this.traineesInFacility = val;
    })
  }

  getTraineeEvents(trainee: any) {
    this.clearEventArrays();
    this.firestoreService.mapUserDataToObject(trainee, "Test", "items").then((val) => {
      this.addElementsToEventList(val)
    });
  }
  getAllEventsTypes(eventType: any) {
    this.clearEventArrays()
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addAllEventsFromType(val, eventType)
    });
  }
  clearEventArrays(){
    this.ownEvents = [];
    this.events = [];
  }
  getOwnData() {
    this.clearEventArrays()
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