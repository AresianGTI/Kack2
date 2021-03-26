import { EnumRoles } from '../services/enums/enums.service';
import { Facility } from './facility';

export interface IRoles {
    trainee: boolean;
    coordinator: boolean;
    admin: boolean;

}

export interface IUser {
    ID: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    role: string,
    name: string;
    firstName: string;
}

export class User implements IUser {
    _ID!: string;
    _email!: string;
    _displayName!: string;
    _emailVerified!: boolean;
    _name!: string;
    _firstName!: string;
    _role!: string;
    private _homeFacility = new Facility(); // sollte in Trainee und Teacher ausgelagert werden

    public get homeFacility() {
        return this._homeFacility;
    }
    public set homeFacility(value) {
        this._homeFacility = value;
    }
    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
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

export class Teacher extends User{
    _role: string = EnumRoles.teacher;
}

export class Trainee extends User{
    _role = EnumRoles.trainee; 
    age!: number; 
    DATE_OF_BIRTH!: Date;
    START_OF_TRAINING!: Date;
    endOfTraining!: Date
}

export class Coordinator extends User{
    _role: string = EnumRoles.coordinator;
}