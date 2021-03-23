export interface IFacility{
    name: string;
    adress: string;
    type: IfacilityType;
    capacity: number;
    usedCapacity: number;
}
export interface IfacilityType{
    typeName: string;
}
export class FacilityType implements IfacilityType{
    typeName!: string;
}
export class Facility implements IFacility{
    private _id!: string;
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    private _name!: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _adress!: string;
    public get adress(): string {
        return this._adress;
    }
    public set adress(value: string) {
        this._adress = value;
    }
    private _type: FacilityType = new FacilityType();
    public get type(): FacilityType {
        return this._type;
    }
    public set type(value: FacilityType) {
        this._type = value;
    }
    private _capacity!: number;
    public get capacity(): number {
        return this._capacity;
    }
    public set capacity(value: number) {
        this._capacity = value;
    }
    private _usedCapacity: number = 0;
    public get usedCapacity(): number {
        return this._usedCapacity;
    }
    public set usedCapacity(value: number) {
        this._usedCapacity = value;
    }
   
}