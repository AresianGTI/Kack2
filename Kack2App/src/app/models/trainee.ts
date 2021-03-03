import { Facility } from "./facility";
import { IUser, Roles } from './user';

export interface ITrainee{
    
}

export class Trainee implements ITrainee, IUser{
    uid!: string;
    roles!: Roles;
    rolesobj : Roles = {trainee : true, admin : false, coordinator :false};  
    displayName!: string;
    test!: string;
    emailVerified!: boolean;
    private _name!: string; 
    private _firstname!: string;
    private _email!: string;
    // constructor(){
    //     this.roles.admin = true;
    //     this.roles.coordinator = true;
    //     this.roles.trainee = true;

    // }
   
    private _home_facility: Facility = new Facility();

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get firstname(): string {
        return this._firstname;
    }
    public set firstname(value: string) {
        this._firstname = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get home_facility(): Facility {
        return this._home_facility;
    }
    public set home_facility(value: Facility) {
        this._home_facility = value;
    }

}
