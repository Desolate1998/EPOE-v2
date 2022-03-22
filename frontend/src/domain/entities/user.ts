import { UserType } from "../enums/UserType";
import { ILoginLog } from "./loginLog";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  active: boolean;
  logins?: ILoginLog[];
  email?:string;
  profilePicture?:string;
}


