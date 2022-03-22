import { UserType } from "../../enums/UserType";

export interface IAuthenticationInformation{
    id:string;
    token:string;
    fullName:string;
    userType:UserType;
    profilePicture?:string|null;
}