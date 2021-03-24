import { Facility } from "./facility";
import { IUser, Roles } from './user';

export class Trainee implements IUser{
    private _ID!: string;
    public get ID(): string {
        return this._ID;
    }
    public set ID(value: string) {
        this._ID = value;
    }
    private _email!: string;
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    private _displayName!: string;
    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }
    private _emailVerified!: boolean;
    public get emailVerified(): boolean {
        return this._emailVerified;
    }
    public set emailVerified(value: boolean) {
        this._emailVerified = value;
    }
    private _rolesobj : Roles = {trainee : true, admin : false, coordinator :false};  
    public get rolesobj(): Roles {
        return this._rolesobj;
    }
    public set rolesobj(value: Roles) {
        this._rolesobj = value;
    }
    private _roles!: Roles;
    public get roles(): Roles {
        return this._roles;
    }
    public set roles(value: Roles) {
        this._roles = value;
    }
    private _homeFacility: Facility = new Facility();
    public get homeFacility(): Facility {
        return this._homeFacility;
    }
    public set homeFacility(value: Facility) {
        this._homeFacility = value;
    }
    private _name!: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _firstName!: string;
    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }
  
}
