import { createContext, useContext } from "react";
import AuthenticationStore from "./AuthenticationStore";
import { GenericTabeStore } from "./GenericTableStore";
import GenralStore from "./GenralStore";


interface Store{
    AuthenticationStore:AuthenticationStore;
    GeneralStore:GenralStore;
    GenericTableStore:GenericTabeStore;
}

export const store:Store ={
    AuthenticationStore: new AuthenticationStore(),
    GeneralStore: new GenralStore(),
    GenericTableStore: new GenericTabeStore(),
}


export const StoreContext = createContext(store)

export function useStore(){
    return useContext(StoreContext);
}