import { IProfileDocument } from "../../entities/profileDocument";
import { IProfileDocumentType } from "../../entities/ProfileDocumentType";
import { requests } from "../agent";
import { ICreateProfileDocumentTypeRequest } from "../contracts/createProfileDocumentType";
import IStudentProfileDocumentInfo from "../Data Transfer Objects/StudentProfileDocumentInfo";

export const ProfileDocumentApi ={
  get:(query:string)=>requests.get<IProfileDocument>(`ProfileDocuments${query}`),
  getAll:(query?:string)=>requests.get<IProfileDocument[]>(`ProfileDocuments${query?query:''}`),
  post:(data:ICreateProfileDocumentTypeRequest)=>requests.post('ProfileDocumentType',data),
  delete:(id:string)=>requests.del('ProfileDocumentTypes/'+id),
  update:(profileDocument:IProfileDocument)=>requests.patch('ProfileDocumentType/'+profileDocument.id,profileDocument),
  getStudentProfileDocuments:()=>requests.get<IStudentProfileDocumentInfo[]>('ProfileDocuments/GetProfileDocumentInfo'),
  uploadProfileDocument: (data:FormData)=>requests.post<number>('ProfileDocuments/UploadProfileDocument',data)
}
