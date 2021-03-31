import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private _userCollection = "usersCollectionOnur";
  public get userCollection() {
    return this._userCollection;
  }

  private _facilityCollection = "facilityCollectionOnur";
  public get facilityCollection() {
    return this._facilityCollection;
  }

  constructor() { }
}
