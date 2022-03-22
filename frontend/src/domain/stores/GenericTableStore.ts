import { makeAutoObservable } from "mobx";

export class GenericTabeStore{
    constructor() {
        makeAutoObservable(this);
        
    }
    
}