
import { observable, autorun } from "mobx"

const AuthState = {
  AUTHED: 'authed',
  NOT_AUTH: 'not_auth'
}

export class UserStore {

  @observable authState = AuthState.NOT_AUTH;

  constructor(state){
    this.authState = state;
  };
  
}