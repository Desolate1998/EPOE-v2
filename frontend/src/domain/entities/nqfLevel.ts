import { IQualification } from "./qualification";

export interface INqfLevel{
    id:number;
    name:string;
    qualifications?:IQualification[];
}