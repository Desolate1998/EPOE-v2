import { IActivity } from "../../entities/activity";
import { requests } from "../agent";
import { IActivityCreateRequest } from "../contracts/activityCreateRequest";


export const ActivityApi = {
    get: (query: string) => requests.get<IActivity>(`Activities${query}`),
    getAll: (query?: string) => requests.get<IActivity[]>(`Activities${query ? query : ''}`),
    post: (data: IActivityCreateRequest) => requests.post<number>('Activities', data),
    delete: (id: string) => requests.del('Activities/' + id),
    update: (activity: IActivity) => requests.patch('Activities/' + activity.id, activity)
};
