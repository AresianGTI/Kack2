import { Injectable } from '@angular/core';




export enum EnumRoles {

    teacher = "teacher",
    coordinator = "coordinator",
    admin = "admin",
    trainee = "trainee",
}

export enum EnumMeetingTypes {

  practicalMeeting = "Praxisanleitung",
  singleMeeting = "Einzelgespräch",
  applyVacation = "Urlaub beantragen",
  notificationOfIlness = "Krankmeldung",
}
@Injectable({
  providedIn: 'root'
})


export class EnumsService {


  // { typeName: "Krankenhaus" },
  // { typeName: "Psychatrie" },
  // { typeName: "Pflegeeinrichtung" },
  // { typeName: "Altersheim" }
  constructor() { }
}
