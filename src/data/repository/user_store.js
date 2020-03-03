import { types, flow } from 'mobx-state-tree';

import { observable, autorun } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import UserInfo from '../model/user_info';
import { PlayList } from '../model/playlist';
import { Artist } from '../model/artist';
import { Album } from '../model/album';


export const AuthState = types.enumeration('AuthState', [
  'authed',
  'none',
  'not_auth',
]);

const AsyncStorageKey = {
  USERINFO: '@userinfo',
};

export const UserStore = types
  .model('UserStore', {
    authState: AuthState,
    playlists: types.maybeNull(types.array(types.reference(PlayList))),
    artists: types.maybeNull(types.array(types.reference(Artist))),
    albums: types.maybeNull(types.array(types.reference(Album))),
  })
  .actions(self => {
    return {
      // gọi khi user login thành công.
      storeUserInfo(userInfo: UserInfo) {
        AsyncStorage.setItem(
          AsyncStorageKey.USERINFO,
          userInfo.toJsonString(),
        ).then(self.saveSuccess, self.saveError);
      },
      saveError(error) {
        console.log('user_Store saveError', error);
      },
      saveSuccess(value) {
        self.authState = 'authed';
        console.log('user_Store saveSuccess');
      },
      removeUserInfo() {
        AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
          self.authState = 'not_auth';
        });
      },
      checkAuthStateAndConfig2() {
        AsyncStorage.getItem(AsyncStorageKey.USERINFO).then(userInfoString => {
          if (userInfoString !== undefined) {
            self.authState = 'authed';
          } else {
            self.authState = 'not_auth';
          }
        });
        self.authState = 'not_auth';
      },

      checkAuthStateAndConfig: flow(function* checkAuthStateAndConfig() {
        var userInfoString = yield AsyncStorage.getItem(
          AsyncStorageKey.USERINFO,
        );
        if (userInfoString !== undefined) {
          self.authState = 'authed';
        } else {
          self.authState = 'not_auth';
        }
      }),
    };
  });
