import { Injectable } from '@angular/core';




export enum EnumRoles {

    teacher = "teacher",
    coordinator = "coordinator",
    admin = "admin",
    trainee = "trainee",
}
@Injectable({
  providedIn: 'root'
})
// enum IRoles {
//   admin = "ss"}


export class EnumsService {


  // { typeName: "Krankenhaus" },
  // { typeName: "Psychatrie" },
  // { typeName: "Pflegeeinrichtung" },
  // { typeName: "Altersheim" }
  constructor() { }
}
