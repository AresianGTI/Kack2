import { FacilityType, IfacilityType } from "./facility";

export interface IUserFirebaseStructure {
    //Firebase Document structure for User
    ID: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    role: string;
    name: string;
    firstName: string;
    homeFacility: string; // String instead of FacilityType/IFacilityType for Forestore Database
}

export interface IFacilityFirebaseStructure {
    //Field strucure for Facility
    ID: string;
    name: string;
    adress: string;
    type: string; // String instead of FacilityType/IFacilityType for Firesstore Database
    capacity: number;
    usedCapacity: number;
}