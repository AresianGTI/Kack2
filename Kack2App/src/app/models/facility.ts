export interface IFacility{
    facilityName: string;
    facilityadress: string;
    facilitytype: IfacilityType;
}
export interface IfacilityType{
    facilitytypeName: string;
}


export class Facility implements IFacility{

    facilityName!: string;
    facilityadress!: string;
    facilitytype!: IfacilityType;
   
    constructor(){
        
    }
}