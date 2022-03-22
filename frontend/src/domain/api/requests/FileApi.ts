
import { requests } from "../agent";



export const FileApi = {
    get: (id:string,fileName:string) => requests.download(`Files?id=${id}`,fileName),

};
