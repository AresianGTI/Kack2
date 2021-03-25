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
    name: string; 
    firstName: string;
 }

 export class User implements IUser{
     _ID!: string;
     _email!: string;
     _displayName!: string;
     _emailVerified!: boolean;
     _rolesobj!: IRoles;
     _roles!: IRoles;
     _name!: string;
     _firstName!: string;
     private _homeFacility = new Facility(); // sollte in Trainee und Teacher ausgelagert werden
     public get homeFacility() {
         return this._homeFacility;
     }
     public set homeFacility(value) {
         this._homeFacility = value;
     }
     

    public get ID(): string {
        return this._ID;
    }
    public set ID(value: string) {
        this._ID = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }

    public get emailVerified(): boolean {
        return this._emailVerified;
    }
    public set emailVerified(value: boolean) {
        this._emailVerified = value;
    }

    public get rolesobj(): IRoles {
        return this._rolesobj;
    }
    public set rolesobj(value: IRoles) {
        this._rolesobj = value;
    }

    public get roles(): IRoles {
        return this._roles;
    }
    public set roles(value: IRoles) {
        this._roles = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }

}