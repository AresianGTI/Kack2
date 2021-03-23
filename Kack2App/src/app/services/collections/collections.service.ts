import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private _userCollection = "users";
  public get userCollection() {
    return this._userCollection;
  }

  constructor() { }
}
