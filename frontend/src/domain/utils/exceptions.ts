import { ExceptionType } from "../enums/ExceptionType";


export interface IException{
    type: ExceptionType;
    message: string;

}