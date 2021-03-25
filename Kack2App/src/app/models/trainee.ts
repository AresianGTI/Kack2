import { EnumRoles } from "../services/enums/enums.service";
import { Facility } from "./facility";
import { IUser, IRoles, User } from './user';

export class Trainee extends User{
    _role = EnumRoles.trainee; 
    age!: number; 
    DATE_OF_BIRTH!: Date;
    START_OF_TRAINING!: Date;
    endOfTraining!: Date
}
