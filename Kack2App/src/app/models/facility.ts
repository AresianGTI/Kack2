export interface IFacility {
    ID: string;
    name: string;
    adress: string;
    type: IfacilityType;
    capacity: number;
    usedCapacity: number;
}
export interface IfacilityType {
    typeName: string;
}
export class FacilityType implements IfacilityType {
    typeName!: string;
}
export class Facility implements IFacility {
    private _ID!: string;

    private _name!: string;
    private _adress!: string;
    private _type: FacilityType = new FacilityType();
    private _capacity!: number;
    private _usedCapacity: number = 0;

    
    public get ID(): string {
        return this._ID;
    }
    public set ID(value: string) {
        this._ID = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get adress(): string {
        return this._adress;
    }
    public set adress(value: string) {
        this._adress = value;
    }

    public get type(): FacilityType {
        return this._type;
    }
    public set type(value: FacilityType) {
        this._type = value;
    }

    public get capacity(): number {
        return this._capacity;
    }
    public set capacity(value: number) {
        this._capacity = value;
    }

    public get usedCapacity(): number {
        return this._usedCapacity;
    }
    public set usedCapacity(value: number) {
        this._usedCapacity = value;
    }

    

}