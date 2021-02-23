import { IFacility } from './facility';

export interface ITrainee{
    name: string;
    firstName: string;
    mainFacility: IFacility;
}
export class Trainee implements ITrainee{
    name!: string;
    firstName!: string;
    mainFacility!: IFacility;
}
