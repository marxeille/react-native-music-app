
import { observable, autorun } from "mobx"
import AsyncStorage from "@react-native-community/async-storage";
import UserInfo from '../model/user_info';

export const AuthState = {
  AUTHED: 'authed',
  NONE: 'none',
  NOT_AUTH: 'not_auth'
}

const AsyncStorageKey = {
  USERINFO: '@userinfo',
}


export class UserStore {

  @observable authState = AuthState.NOT_AUTH;

  constructor(authState) {
    this.authState = authState;
  };
  // gọi khi user login thành công.
  storeUserInfo = async (userInfo: UserInfo) => {
    console.log('DEBUG => user_store storeUserInfo', userInfo);
    try {
      console.log('DEBUG => user_store ', userInfo.toJsonString());
      await AsyncStorage.setItem(AsyncStorageKey.USERINFO, userInfo.toJsonString())
      this.authState = AuthState.AUTHED;
    } catch (e) {
      console.log('DEBUG => user_store storeUserInfo error', e);
      //TODO: Handle Error
    }
  }

  //Gọi trong splash screen để biết nên vào màn nào.
  checkAuthStateAndConfig = async () => {
    try {
      userInfoString = await AsyncStorage.getItem(AsyncStorageKey.USERINFO);
      console.log('DEBUG => user_store checkAuthStateAndConfig userInfoString');
      if (userInfoString === undefined) {
        this.authState = AuthState.AUTHED;
      } else {
        this.authState = AuthState.NOT_AUTH;
      }
    } catch (e) {
      //TODO: Handle Error
      this.authState = AuthState.NOT_AUTH;
      console.log('DEBUG => user_store checkAuthStateAndConfig errror', e);
    }
  }
}