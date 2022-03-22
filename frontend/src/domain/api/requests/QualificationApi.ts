
import { IQualification } from "../../entities/qualification";
import { requests } from "../agent";




export const QualificationApi = {
    get: (query: string) => requests.get<IQualification>(`Qualifications${query}`),
    getList: (query?:string) => requests.get<IQualification[]>(`Qualifications${query?query:''}`),
    post: (data: any) => requests.post('Qualifications', data),
    delete: (id: string) => requests.del('Qualifications/' + id),
    update: (qualification: IQualification) => requests.patch('Qualifications/' + qualification.id, qualification)
};
