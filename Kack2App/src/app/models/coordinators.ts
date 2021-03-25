import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { Facility } from './facility';
import { IUser, IRoles } from './user';

export interface Coordinators{

}
export class Coordinators implements IUser{
    
    private _ID!: string;
    private _homeFacility!: Facility;
    private _firstName!: string;   
    private _home_facility: Facility = new Facility();
    private _uid!: string;
    private _email!: string;
    private _roles!: IRoles;
    private _rolesobj: IRoles = { trainee: false, admin: false, coordinator: true }; 
    private _displayName!: string;
    private _test!: string;
    private _emailVerified!: boolean;
    private _name!: string;
    private _firstname!: string;
   


    public get ID(): string {
        return this._ID;
    }
    public set ID(value: string) {
        this._ID = value;
    }
    public get homeFacility(): Facility {
        return this._homeFacility;
    }
    public set homeFacility(value: Facility) {
        this._homeFacility = value;
    }
    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }
    public get home_facility(): Facility {
        return this._home_facility;
    }
    public set home_facility(value: Facility) {
        this._home_facility = value;
    }
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get roles(): IRoles {
        return this._roles;
    }
    public set roles(value: IRoles) {
        this._roles = value;
    }
    public get rolesobj(): IRoles {
        return this._rolesobj;
    }
    public set rolesobj(value: IRoles) {
        this._rolesobj = value;
    }
    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }
    public get test(): string {
        return this._test;
    }
    public set test(value: string) {
        this._test = value;
    }
    public get emailVerified(): boolean {
        return this._emailVerified;
    }
    public set emailVerified(value: boolean) {
        this._emailVerified = value;
    }
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
}