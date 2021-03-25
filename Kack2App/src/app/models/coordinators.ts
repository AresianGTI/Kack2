import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnumRoles } from '../services/enums/enums.service';
import { Facility } from './facility';
import { IUser, IRoles, User } from './user';

export interface Coordinators{

}
export class Coordinators extends User{
    _rolesobj: IRoles = { trainee: false, admin: false, coordinator: true }; 
    _role: string = EnumRoles.coordinator;
}