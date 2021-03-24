import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { Facility } from './facility';
import { IUser, Roles } from './user';

export interface Coordinators{

}
export class Coordinators implements IUser{
    ID!: string;
    homeFacility!: Facility;
    firstName!: string;
    home_facility: Facility = new Facility();
    uid!: string;
    email!: string;
    roles!: Roles;
    rolesobj : Roles = {trainee : false, admin : false, coordinator :true}; 
    displayName!: string;
    test!: string;
    emailVerified!: boolean;
    name!: string;
    firstname!: string;

}