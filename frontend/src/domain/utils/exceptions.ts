export enum ExceptionType{
    NotFound =0,
    NotAllowed=1,
    InputNotValid=2
}

export interface IException{
    type: ExceptionType;
    message: string;

}