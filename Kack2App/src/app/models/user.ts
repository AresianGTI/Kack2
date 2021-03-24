import { Facility } from './facility';

export interface Roles{
    trainee: boolean;
    coordinator: boolean;
    admin: boolean;

}
export interface IUser {
    ID: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    rolesobj : Roles;
    roles: Roles;
    homeFacility: Facility
    name: string; 
    firstName: string;
 }