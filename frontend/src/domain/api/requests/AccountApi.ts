import { requests } from "../agent";
import { ILoginModel } from "../contracts/login";
import { IRegister } from "../contracts/register";


export const AccountApi={
    login:(Data:ILoginModel)=>requests.post<string>('login',Data),
    register:(Data:IRegister)=>requests.post<string>('register',Data)
}