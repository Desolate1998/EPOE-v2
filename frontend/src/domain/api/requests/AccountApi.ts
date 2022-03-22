import { requests } from "../agent";
import { ILoginModel } from "../contracts/login";
import { IRegister } from "../contracts/register";
import { IAuthenticationInformation } from "../Data Transfer Objects/AuthenticationInformation";



export const AccountApi={
    
    login:(Data:ILoginModel)=>requests.post<IAuthenticationInformation>('/Accounts/login',Data),
    register:()=>requests.post<string>('Accounts/register',{}),
    autoLogin:()=>requests.get<any>('/Accounts/AutoLogin/')
}