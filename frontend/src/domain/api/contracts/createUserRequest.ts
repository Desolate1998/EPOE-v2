import { UserType } from "../../enums/UserType";

export interface ICreateUserRequest{
  email:string;
  phoneNumber:string;
  firstName:string;
  lastName:string;
  userType:UserType;
}