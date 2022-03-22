import { IFile } from "./file";

export interface IProfileDocument{
  id:number;
  fileId:number;
  profileDocumentTypeId:number;
  status:string;
  profileDocument:IProfileDocument|null;
  file:IFile
}



