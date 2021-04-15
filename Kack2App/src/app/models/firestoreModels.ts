import { FacilityType, IfacilityType } from "./facility";

/**The following interfaces are declaring the documentstructures for the firestore
 * 
 */

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
    homeFacilityID: string;
}

export interface ICoordinatorFireBaseStructure {
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