import {
  Injectable, IterableDiffers
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
  eachWeekOfInterval,
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
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ArrayType } from '@angular/compiler';
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
  eventsTest: CalendarEvent[] = [];
  public traineesInFacility: any[]= [];

  predefinedEvents(type: string, color: any) {
    let menmen: any = {
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
    return menmen;
  }
  eventDataTest(event: any) {
    let menmen: any = {
      start: new Date(event.start.seconds * 1000),
      end: new Date(event.end.seconds * 1000),
      title: event.title,
      color: event.color,
      allDay: event.allDay,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      name: "MeinNameIst"
    }
    console.log("MENMEN: ", menmen)
    return menmen;
  }
  // loadEventData(event: any) {
  //   let menmen: any = {
  //     start: new Date(event.start.seconds * 1000),
  //     end: new Date(event.end.seconds * 1000),
  //     title: event.title,
  //     color: event.color,
  //     allDay: event.allDay,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     name: "MeinNameIst"
  //   }
  //   console.log("LoadEventData: ", menmen)
  //   return menmen;
  // }

  traineeEvents: CalendarEvent[] = [
    this.predefinedEvents(EnumMeetingTypes.applyVacation, colors.red),
    this.predefinedEvents(EnumMeetingTypes.notificationOfIlness, colors.green)
  ];

  coordinatorEvents: CalendarEvent[] = [
    this.predefinedEvents(EnumMeetingTypes.practicalMeeting, colors.blue),
    this.predefinedEvents(EnumMeetingTypes.singleMeeting, colors.yellow)
  ]
  safeNewEvent() {
    console.log("OwnEvetns in Safe: ", this.events)
    this.events.filter((event) => {
      if (event.title != "" )  {
        this.setEventData(event);
      } else {
        console.log("testoMets");
        this.deleteEvent(event);
      }
    })
  }


  // addNewEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     this.eventData("", colors.black)
  //   ];
  //   console.log("AddEvent: ", this.events)
  // }
  addEvent(): void {
    this.events = [
      ...this.events,
      this.predefinedEvents("", colors.black)
    ];
    console.log("AddEvent: ", this.events)
  }
  // addOwnEvents(event: any) {
  //   this.ownEvents = [
  //     ...this.ownEvents,
  //     this.loadEventData(event)
  //   ];
  //   console.log("AddOwnEvents: ", event)

  // }
  addEventTest(event: any) {

    event.start = new Date(event.start.seconds * 1000);
    event.end  = new Date(event.end.seconds * 1000);
    this.events = [
      ...this.events,
      event
    //  this.loadEventData(event)
    ];
    console.log("AddEventTEst: ", event)

  }
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events.filter((event) => this.firestoreService.deleteDocument(event, "Test"));
    // this.events = this.ownEvents.filter((event) => event !== eventToDelete);
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  item: any = {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
    title: "type",
    color: colors.black,
    allDay: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    name: "MeinNameIst"
  }
  menmen: any = {
    UID: "",
    items: {
    }
  }

  setEventData(event: any) {
    let id = this.firestoreService.createID();
    this.menmen.UID = this.authService.userData?.ID;
    this.menmen.Name = this.authService.userData?.name;
    this.menmen.items["ItemID " + id] = event;
    console.log("stabil: ", this.menmen);
    this.firestoreService.updateDocument("Test", this.menmen);
  }
  loadEvents(action: string) {
    this.events = [];
    if (action == "coordinator") {
      // guard= true;
      this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
        this.addElementsToEventList(val)
      });
    }
    else if (action == "trainee") {
      this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
        // this.addElementsToEventList(val)
        this.addElementsToEventList(val)
      });
    }
    this.getTrainees();
  }
  addElementsToOwnEventList(val: any) {
    this.ownEvents= val;
    
    // this.ownEvents.forEach((element: any) => {
    //   this.addOwnEvents(element[1]);
      
    // });
    // 
    // this.events= this.ownEvents;
    this.events= this.ownEvents;
    console.log("OwnEvents: ", this.events)
    this.refresh.next();
    // console.log("EVENTSLAN: ", this.events)
  }
  addElementsToEventList(val: any) {
    this.eventsTest= val;
    console.log("AllEvents: ", this.eventsTest)
    this.eventsTest.forEach((element: any) => {
      this.addEventTest(element[1]);
      this.refresh.next();
    });
  }

  getTrainees(){
       this.firestoreService.getbbb(this.authService.userData).then((val) => {
        console.log("Returned: ", val)
        this.traineesInFacility = val;
      })
  }
  getTraineeEvents(trainee: any){
 this.events = [];
    this.firestoreService.mapUserDataToObject(trainee, "Test", "items").then((val) => {
      this.addElementsToEventList(val)
    });
  }
  getOwnData(){
    // this.ownEvents = [];
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToEventList(val)
    });
  }
 
  getAllEventsFromAllUser() {
    this.events = [];
    this.firestoreService.mapUserDataToObject(this.authService.userData, "Test", "items").then((val) => {
      this.addElementsToEventList(val)
    });

    this.firestoreService.getbbb(this.authService.userData).then((val) => {
      console.log("Returned Array: ", val)
      this.traineesInFacility = val;
      val.forEach((element: any) => {
        this.firestoreService.getAllCollectionItems(element, "Test", "items").then((arr) => {
          this.addElementsToEventList(arr);
      });
    })
    })
  }
  
  logEventData(){
    console.log("EventTest: ", this.eventsTest);
    console.log("events: ", this.events);
    console.log("OwnEvents: ", this.ownEvents);
  }
}