import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private _userCollection = "usersCollection";
  public get userCollection() {
    return this._userCollection;
  }

  private _facilityCollection = "facilities";
  public get facilityCollection() {
    return this._facilityCollection;
  }

  constructor() { }
}
