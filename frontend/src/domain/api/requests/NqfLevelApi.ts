import { INqfLevel } from "../../entities/nqfLevel";
import { requests } from "../agent";

import INqfCreateRequerst from "../contracts/nqfCreateRequest";


export const NqfLevelApi={
    get:(query:string)=>requests.get<any>(`NqfLevels${query}`),
    getAll:(query?:string)=>requests.get<INqfLevel[]>(`NqfLevels${query?query:''}`),
    post:(data:INqfCreateRequerst)=>requests.post('NqfLevels',data),
    delete:(id:string)=>requests.del('NqfLevels/'+id),
    update:(nqfLevel:INqfLevel)=>requests.patch('NqfLevels/'+nqfLevel.id,nqfLevel)
}



