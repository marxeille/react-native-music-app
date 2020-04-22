import { types, flow, getParent } from 'mobx-state-tree';

import { observable, autorun } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import UserInfo from '../model/user_info';
import { PlayList, createPlaylistFromJson } from '../model/playlist';
import { Artist } from '../model/artist';
import { Album } from '../model/album';
import { apiService } from '../context/api_context';
import { AsyncStorageKey } from '../../constant/constant';

export const AuthState = types.enumeration('AuthState', [
  'authed',
  'none',
  'not_auth',
]);

export const UserStore = types
  .model('UserStore', {
    authState: AuthState,
    user_id: types.optional(types.number, 0),
    name: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string),
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
      },

      removeSuccess(value) {
        self.authState = 'not_auth';
      },

      removeUserInfo() {
        AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
          self.removeSuccess(value);
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
        if (
          userInfoString !== undefined &&
          userInfoString !== '' &&
          userInfoString !== null
        ) {
          self.authState = 'authed';
        } else {
          self.authState = 'not_auth';
        }
      }),

      getUserInfo: flow(function* getUserInfo() {
        const userInfoString = yield AsyncStorage.getItem(
          AsyncStorageKey.USERINFO,
        );
        return userInfoString;
      }),

      setUserInfo(user) {
        self.name = user.fullname;
        self.avatar = user.avatar_path;
        self.id = user.id;
      },

      fetchUserData: flow(function* fetchUserData() {
        const userData = yield apiService.commonApiService.getUserInfo();
        if (userData.status == 200) {
          self.setUserInfo(userData.data);
        }
      }),

      fetchPlayListOfUser: flow(function* fetchPlayListOfUser() {
        var playlist: Array = yield apiService.commonApiService.getPlaylistOfUser();
        var playlistOfUser = [];
        playlist.forEach(data => {
          getParent(self).updatePlayList(data); //For RootStore
          playlistOfUser.push(data.id);
        });
        self.playlists = playlistOfUser;
      }),

      getAccessToken() {
        return self.token;
      },
    };
  });
