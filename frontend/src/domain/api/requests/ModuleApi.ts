import { IModule } from "../../entities/module";
import { INqfLevel } from "../../entities/nqfLevel";
import { requests } from "../agent";
import { IModuleCreateRequest } from "../contracts/moduleCreateRequest.";



export const ModuleApi = {
    get: (query: string) => requests.get<IModule>(`Modules${query}`),
    getAll: (query?: string) => requests.get<IModule[]>(`Modules${query ? query : ''}`),
    post: (data: IModuleCreateRequest) => requests.post<number>('Modules', data),
    delete: (id: string) => requests.del('Modules/' + id),
    update: (module: IModule) => requests.patch('Modules/' + module.id, module)
};






