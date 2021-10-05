import { createContext, useContext } from "react";
import AuthenticationStore from "./AuthenticationStore";


interface Store{
    AuthenticationStore:AuthenticationStore
}

export const store:Store ={
    AuthenticationStore: new AuthenticationStore()
}


export const StoreContext = createContext(store)

export function useStore(){
    return useContext(StoreContext);
}