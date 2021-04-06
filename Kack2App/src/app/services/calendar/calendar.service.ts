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
    public afs: AngularFirestore) { }
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  date = new FormControl(new Date());
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  eventData(type: string, color: any) {
    let menmen: any = {
      // UID: this.authService.userData?.ID,
      ID: this.firestoreService.createID(),
      // start: subDays(startOfDay(new Date(),1),
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      // start: startOfDay(new Date()),
      // end: endOfDay(new Date()),
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
  eventDataTest(event:any ) {
    let menmen: any = {
      // UID: this.authService.userData?.ID,
      ID: event.ID,
      // start: subDays(startOfDay(new Date(),1),
      start: new Date (event.start.seconds * 1000),
      end:   new Date (event.end.seconds * 1000),
      // end: addDays(new Date(),1),
      title: event.title,
      color: event.color,
      allDay: event.allDay,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    console.log("MENMEN: ", menmen)
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
        // this.firestoreService.createDocument("Test", event);
        this.setEventData(event);
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
  addEventTest(event: any): void {
    this.events = [
      ...this.events,
      this.eventDataTest(event)
    ];
  }
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events.filter((event) => this.firestoreService.deleteDocument(event, "Test"));
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  item: any = {
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
  menmen: any = {
    UID: "",
    items: {
    }
  }

  setEventData(event: any) {
    let id = this.firestoreService.createID();
    this.menmen.UID = this.authService.userData?.ID;
    this.menmen.items["ItemID " + id] = event;
    console.log("stabil: ", this.menmen);
    this.firestoreService.updateDocument("Test", this.menmen);
  }
  dataMata() {
    this.getUserData(this.authService.userData).then((val) => {
      console.log("val: ", val);
      this.eventsTest = val;
      console.log("events: ", this.eventsTest)
      val.forEach((element: any) => {

        console.log("Element: ", element[1])
        this.addEventTest(element[1]);
        this.refresh.next();
      });
    });
  }
  getUserData = (user: any): Promise<any> => {
    this.events = [];
    var docRef = this.afs.collection("Test").doc(`${user.ID}`);
    return docRef.ref.get().then((doc) => {
      let arr = [];
      let data: any = doc.data();
      try {
        for (const [key, value] of Object.entries(data.items)) {
          arr.push([key, value]);
        }
      }
      catch {
        console.log("keine Daten in der Datenbank")
      }
      return arr;
    })
  }

   getAllCalendarData(collection: string) {
    let fieldList: Array<{}> = [];
    this.afs.collection(collection)
      .get().toPromise().then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log("DocData: ", doc.data());
          let arr = [];
      let data: any = doc.data();
      try {
        for (const [key, value] of Object.entries(data.items)) {
          arr.push([key, value]);
        }
      }
      catch {
        console.log("Sheesh")
      }
          // fieldList.push(doc.get(field));
        })
      })
    // return fieldList;
  }

  //Events auf null setzen bei Destroy
}