import { IProfileDocument } from "./profileDocument";

export interface IProfileDocumentType{
  id:number; 
  name:string;
  description:string;
  active:boolean;
  profileDocuments:IProfileDocument[]|null

}
