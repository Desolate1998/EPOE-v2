import { IModule } from "./module";
import { INqfLevel } from "./nqfLevel";

export interface IQualification{
    id:number;
    name:string;
    nqfLevelId:number;
    active:boolean;
    nqfLevel?:INqfLevel;
    modules:IModule[];
    description:string; 
}
