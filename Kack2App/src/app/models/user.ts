export interface Roles{
    trainee?: boolean;
    coordinator?: boolean;
    admin?: boolean;

}
export interface User {
    uid: string;
    email: string;
    roles: Roles;
    displayName: string;
    test: string;
    emailVerified: boolean;
    name: string; 
    firstname: string;
 }