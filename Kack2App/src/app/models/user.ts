import { Facility } from './facility';

export interface IRoles{
    trainee: boolean;
    coordinator: boolean;
    admin: boolean;

}
export interface IUser {
    ID: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    rolesobj : IRoles;
    roles: IRoles;
    homeFacility: Facility
    name: string; 
    firstName: string;
 }