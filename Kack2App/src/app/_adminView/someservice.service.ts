import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SomeserviceService {

  constructor() { }

  // doSomething(): Observable<PeriodicElement[]> {
  //   // commonly something like:
  //   // return this.httpClient.get('https://example.org/rest-api/items/');
  //   return 
  // }

}

export interface IPeriodicElement {
  Name: string;
  Position: number;
  Adresse: string;
  Einrichtungsart: string;
}
export class PeriodicElement implements IPeriodicElement {
  Name!: string;
  Position!: number;
  Adresse!: string;
  Einrichtungsart!: string;
  constructor() {
  }
}

