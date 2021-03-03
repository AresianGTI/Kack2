export interface IFacility{
    facilityName: string;
    facilityadress: string;
    facilitytype: IfacilityType;
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
   
    constructor(){
        this.facilityName ="Facname";
        this.facilityadress ="facadress";
        this.facilitytype.facilitytypeName =" facType --> FactypeName";
        console.log("Ich bin die FacilityKlasse", this.facilityName, this.facilityadress, this.facilitytype);
    }
}