import { IProfileDocumentType } from "../../entities/ProfileDocumentType";
import { requests } from "../agent";
import { ICreateProfileDocumentTypeRequest } from "../contracts/createProfileDocumentType";

export const ProfileDocumentTypeApi ={
  get:(query:string)=>requests.get<any>(`ProfileDocumentTypes${query}`),
  getAll:(query?:string)=>requests.get<IProfileDocumentType[]>(`ProfileDocumentTypes${query?query:''}`),
  post:(data:ICreateProfileDocumentTypeRequest)=>requests.post('ProfileDocumentTypes',data),
  delete:(id:string)=>requests.del('ProfileDocumentTypes/'+id),
  update:(profileDocumentType:IProfileDocumentType)=>requests.patch('ProfileDocumentTypes/'+profileDocumentType.id,profileDocumentType)
}
