import { ICampus } from "../../entities/campus";
import { requests } from "../agent";
import { ICampusCreateRequest } from "../contracts/campusCreateRequest";

export const CampusApi = {
  get: (query: string) => requests.get<ICampus>(`Campuses${query}`),
  getAll: (query?: string) => requests.get<ICampus[]>(`Campuses${query ? query : ''}`),
  post: (data: ICampusCreateRequest) => requests.post<number>('Campuses', data),
  delete: (id: string) => requests.del('Campuses/' + id),
  update: (campus: ICampus) => requests.patch('Campuses/' + campus.id, campus)
};
