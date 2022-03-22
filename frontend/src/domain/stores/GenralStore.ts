import { makeAutoObservable, observable } from "mobx";

export default class GenralStore{
    constructor() {
       makeAutoObservable(this)
    }
    @observable dimmerOpenboolean =false;
}
    