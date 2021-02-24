import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private checkAuthorization(user: User, allowedRoles: string[]): boolean
  {
    if(!user) return false;
    for (const role of allowedRoles)
    {
      if(user.roles[role]){
        return true;

      }

    }
    return false;
  }
  canRead(user:User): boolean
  {
    const allowed = ["admin", "coordinator", "trainee"];
    return this.checkAuthorization(user, allowed);
  }
}
