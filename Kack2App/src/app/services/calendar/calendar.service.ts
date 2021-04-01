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
  

  stabil: any[] = []
  item: any ={
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
    items:{
    }
  }
 
  testData() {
    

      // this.getUserData(this.authService.userData).then((val) => {
      //   if(val)
      //   {
          // console.log("Val ObjData: ", val);
          // this.stabil.indexOf("")
          let id = this.firestoreService.createID();
            // this.stabil.push(menmen);
            this.menmen.UID =this.authService.userData?.ID;
            this.menmen.items["ItemID "+ id] = this.item;
            console.log("stabil: ", this.menmen);
          this.firestoreService.updateDocument("Test", this.menmen);
      //   }
      //   else
      //   {
      //     this.stabil = [menmen]
      //     // this.stabil = [...this.stabil, menmen]
      //     console.log("Else");
      //     // this.firestoreService.updateDocument("Test", this.stabil);
      //   }
      // })
   
  }
  gggg() {
    let js = {
      item:{
        ff: 22,
        sss: 1
      }
     
    }
    return js
  }
  dataMata() {
    this.getUserData(this.authService.userData);
  }
  getUserData = (user: any): Promise<any> => {
    var docRef = this.afs.collection("Test").doc(`${user.ID}`);
    return docRef.ref.get().then((doc) => {
      console.log("Data des Kalenders:", doc.data());
      console.log("UID:", user.ID);
      return doc.data();
    })
  }
  // getDocFromCollection(collection: string, data: any):Array<any> {
  //   let fieldList: Array<{}> = [];
  //   this.afs.collection("collection", ref => ref.where("UID", "==", data.UID) )
  //     .get().toPromise().then(snapshot => {
  //       snapshot.docs.forEach(doc => { 
  //         fieldList.push(doc.get());
  //       })
  //     })
  //     return fieldList;
  // }
  // this.facilityList =  this.fireStoreService.getFieldsFromCollection( this.collectionService.facilityCollection, "Name")
  // console.log("Das sind die Data im Dialog", this.facilityList);
  // this.onQuery( this.firestore.collection('users', ref => ref
  // .where("roles", "==", trainee)));
}