import { IActivity } from "./activity";

export interface IModule{
    id:number;
    name:string;
    active:boolean;
    description:string;
    activities:IActivity[]
}

