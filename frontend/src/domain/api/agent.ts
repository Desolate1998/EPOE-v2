import axios, { Axios, AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { IException } from "../utils/exceptions";
import settings from '../../appConfig.json'
import { store, useStore } from "../stores/Store";

interface IResponse<TData> {
    data: TData;
    isSuccessful: boolean;
    errors: IException[]
}



axios.interceptors.response.use((res:AxiosResponse<IResponse<any>>)=>{
  if(res.data.isSuccessful){
    return res
  }
},(error:AxiosError)=>{
//Handle server errors here
  const {status} = error.response!
  switch (status) {
    case 404:
       
      break;
  
    default:
      break;
  }
});

axios.defaults.baseURL = settings.serverUrl;
const responseBody = <T>(response: AxiosResponse<IResponse<T>>) => response.data;


axios.interceptors.request.use(config => {
  const token = store.AuthenticationStore.token;

    if(config.headers)
            config.headers.Authorization = `Bearer ${token}`
  return config;
});



export const requests = {
  get:<T>(url: string) => axios.get<IResponse<T>>(url).then(responseBody),
  post: <T>(url: string, body:any) =>axios.post<IResponse<T>>(url, body).then(responseBody),
  put: <T>(url: string, body:any) =>axios.put<IResponse<T>>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<IResponse<T>>(url).then(responseBody)
}



