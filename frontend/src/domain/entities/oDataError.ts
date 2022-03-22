export interface ODataError{
    status:number;
    statusText:string;
    data:ODataErrorData
}

interface ODataErrorData{

    message:string
}