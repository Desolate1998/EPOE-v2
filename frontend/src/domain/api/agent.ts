import axios, { AxiosResponse } from "axios";

import settings from '../../appConfig.json'
import { store } from "../stores/Store";






axios.defaults.baseURL = settings.serverUrl;
const responseBody = <T>(response: AxiosResponse<T>) => response.data;


axios.interceptors.request.use(config => {
  const token = store.AuthenticationStore.user.token;
    if(config.headers)
            config.headers.Authorization = `Bearer ${token}`
  return config;
});



export const requests = {
  get:<T>(url: string,query?:string) => axios.get<T>(url,{
    params:query
  }).then(responseBody),
  post: <T>(url: string, body:any) =>axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body:any) =>axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  patch:<T>(url:string,body:any)=>axios.patch<T>(url,body).then(responseBody),
  Download: <T>(urlFile: string) => {
    axios.get<Blob>(urlFile).then(responseBody)
  },
  //@ts-ignore
  download:(url:string,fileName:string)=>axios.get<Blob>(url,{responseType:'blob'}).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download',fileName);
    document.body.appendChild(link);
    link.click();
  })

}

