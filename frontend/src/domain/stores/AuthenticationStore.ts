import { makeAutoObservable, observable } from "mobx";


export default class AuthenticationStore{
    constructor() {
       makeAutoObservable(this)
    }
    @observable token ='';


}