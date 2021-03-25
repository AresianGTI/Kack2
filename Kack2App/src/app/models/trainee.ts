import { Facility } from "./facility";
import { IUser, IRoles, User } from './user';

export class Trainee extends User{
    _rolesobj : IRoles = {trainee : true, admin : false, coordinator :false};
    
    age!: number; 
    DATE_OF_BIRTH!: Date;
    START_OF_TRAINING!: Date;
    endOfTraining!: Date
}
