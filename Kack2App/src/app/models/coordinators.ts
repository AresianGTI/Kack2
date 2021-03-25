import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { Facility } from './facility';
import { IUser, IRoles, User } from './user';

export interface Coordinators{

}
export class Coordinators extends User{
    _rolesobj: IRoles = { trainee: false, admin: false, coordinator: true }; 
}