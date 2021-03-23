import { Facility } from './facility';

export interface Roles{
    trainee: boolean;
    coordinator: boolean;
    admin: boolean;

}
export interface IUser {
    uid: string;
    email: string;
    rolesobj : Roles;
    roles: Roles;
    displayName: string;
    test: string;
    emailVerified: boolean;
    name: string; 
    firstname: string;
    home_facility: Facility;
 }