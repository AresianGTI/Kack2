import { Facility } from "./facility";

export interface ITrainee{
    name: string;
    firstname: string;
    home_facility: Facility;
}

export class Trainee implements ITrainee{
    private _name!: string; 
    private _firstname!: string;
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
    public get home_facility(): Facility {
        return this._home_facility;
    }
    public set home_facility(value: Facility) {
        this._home_facility = value;
    }

}