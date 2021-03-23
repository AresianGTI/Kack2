import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalstringsService {
// Routes
  private _overview = "overview";
  public get overview() {
    return this._overview;
  }
  private _loginView = "loginView";
  public get loginView(){
    return this._loginView;
  }

  constructor() { }
}
