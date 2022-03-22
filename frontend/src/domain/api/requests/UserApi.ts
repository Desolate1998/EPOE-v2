import { type } from "os";
import { IUser } from "../../entities/user";
import { UserType } from "../../enums/UserType";
import { requests } from "../agent";
import { ICreateUserRequest } from "../contracts/createUserRequest";
import { IUserLoginsStatisticsInformation } from "../Data Transfer Objects/userLoginStatisticsInformation";


export const UserApi={
  get: (query: string) => requests.get<IUser>(`Users${query}`),
  getList: (query?:string) => requests.get<IUser[]>(`Users${query?query:''}`),
  post: (data: ICreateUserRequest) => requests.post('Users', data),
  delete: (id: string) => requests.del('Users/' + id),
  update: (user: IUser) => requests.patch('Users/' + user.id, user),
  uploadProfileImage:(data:FormData) => requests.post<string>('Users/ProfileImageUpload',data),
  removeProfilePicture:()=>requests.post('Users/RemoveProfilePicture',{}),
  updatePassword:(data:FormData) =>requests.post('Users/UpdatePassword',data),
  me:()=>requests.get<IUser>('Users/Me'),
  getUserInRole:<T>(role:UserType) => requests.get(`Users/GetUserInRole?role=${role}&$select=firstName,lastName,id`),
  
}