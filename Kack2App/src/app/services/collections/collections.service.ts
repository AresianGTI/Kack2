import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class CollectionsService {

  public static userCollection = "usersCollectionOnur";
  public static facilityCollection = "facilityCollectionOnur";

  constructor() { }
}
