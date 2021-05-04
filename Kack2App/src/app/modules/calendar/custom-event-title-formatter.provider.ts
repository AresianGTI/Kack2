import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EnumMeetingTypes } from 'src/app/services/enums/enums.service';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string,
  public authService: AuthService,
  public firestoreService: FirestoreService,
  public calendarService: CalendarService) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: any): string {
    console.log("EVENT: ", event)
    let text;
    if(event.title == EnumMeetingTypes.applyVacation){
      text = " von " +  event.sender.name
    }
    else if(event.title == EnumMeetingTypes.practicalMeeting){
      text = " "
    }
    else if(event.title == EnumMeetingTypes.singleMeeting){
      let gg: any[] = [];
      event.receiver.forEach((events: any) => {
        gg.push(events.name)
      });
      text = " mit " + gg;
    }
    else if(event.title == EnumMeetingTypes.notificationOfIlness){
      text = " von " + event.sender.name
    }

    if(this.authService.userData.role == "trainee")
    {
      return event.title;
    }
    else{
      // return      event.title, text, this.authService.userData.name
      return   ` ${
        event.title
      }  ${text}  ` ;
    }
  
  }

  week(event: CalendarEvent): string {
    return `<b>${formatDate(event.start, 'h:m a', this.locale)}</b> ${
      event.title
    }`;
  }

  day(event: CalendarEvent): string {
    return `<b>${formatDate(event.start, 'h:m a', this.locale)}</b> ${
      event.title
    }`;
  }
}