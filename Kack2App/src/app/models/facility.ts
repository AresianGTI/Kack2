export interface IFacility{
    facilityName: string;
    facilityadress: string;
    facilitytype: IfacilityType;
    capacity: number;
    usedCapacity: number;
}
export interface IfacilityType{
    facilitytypeName: string;
}
export class FacilityType implements IfacilityType{
    facilitytypeName!: string;
}
export class Facility implements IFacility{

    facilityName!: string;
    facilityadress!: string;
    facilitytype: FacilityType = new FacilityType();
    capacity!: number;
    usedCapacity: number = 0;
   
    constructor(){
        this.facilityName ="Facname";
        this.facilityadress ="facadress";
        this.facilitytype.facilitytypeName =" facType --> FactypeName";
        console.log("Ich bin die FacilityKlasse", this.facilityName, this.facilityadress, this.facilitytype);
    }
}