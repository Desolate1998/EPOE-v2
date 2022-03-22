import { AxiosError } from "axios";
import { makeAutoObservable, observable, action } from "mobx";
import { dimmerStatus, useDimmer } from "../../components/Dimmer";
import { ILoginModel } from "../api/contracts/login";
import { IRegister } from "../api/contracts/register";
import { IAuthenticationInformation } from "../api/Data Transfer Objects/AuthenticationInformation";
import { AccountApi } from "../api/requests/AccountApi";
import { store } from "./Store";


export default class AuthenticationStore {
    constructor() {
        makeAutoObservable(this)
        if (window.localStorage.getItem('user')) {
            this.user = JSON.parse(window.localStorage.getItem('user')!)
            AccountApi.autoLogin()
            console.log(this.user)
            this.autoLogin =true;
        }
    }

    @observable autoLogin = false;
    @observable loading = false;
    @observable errored = false;
    @observable message = '';
    @observable user: IAuthenticationInformation = {
        id:'',
        fullName: '',
        token: '',
        userType: 1,
        profilePicture:null
    };
 

    @action updateCookie(){
        window.localStorage.setItem('user',JSON.stringify(this.user));
    }

    @action async register() {
        this.loading = true
        let  res= await  AccountApi.register();
        console.log(res)
    }

    @action async login(data: ILoginModel, autoLogin: boolean) {
        store.GeneralStore.dimmerOpenboolean = true;
        this.errored = false;
        try {
            let res = await AccountApi.login(data);
            this.user = res;
            if (autoLogin) {
                window.localStorage.setItem('user',JSON.stringify(res));
                autoLogin =true;
            }
        } catch (error) {
            var er = error as AxiosError;
            this.message = er.response?.data!;
            this.errored = true;

        } finally {
            store.GeneralStore.dimmerOpenboolean = false;
        }


    }

}