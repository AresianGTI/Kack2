import { Facility } from "./facility";
import { IUser, IRoles } from './user';

export class Trainee implements IUser{
    private _ID!: string;
    private _email!: string;
    private _displayName!: string;
    private _emailVerified!: boolean;
    private _rolesobj : IRoles = {trainee : true, admin : false, coordinator :false};  
    private _roles!: IRoles;
    private _homeFacility: Facility = new Facility();
    private _name!: string;    
    private _firstName!: string;


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

    public get homeFacility(): Facility {
        return this._homeFacility;
    }
    public set homeFacility(value: Facility) {
        this._homeFacility = value;
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
