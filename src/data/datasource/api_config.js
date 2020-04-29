import { create } from 'apisauce';
import { BASE_API_URL } from '../../constant/constant';
import AsyncStorage from '@react-native-community/async-storage';
import UserInfo from '../model/user_info';
import { AsyncStorageKey } from '../../constant/constant';
import { getRandomNumber } from '../../utils';
import Toast from 'react-native-simple-toast';

export const injectBearer = (token, configs) => {
  if (!configs) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  if (configs.headers) {
    return {
      ...configs,
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {
    ...configs,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const privateRequest = async (request, url, data, configs) => {
  try {
    const token = await AsyncStorage.getItem(AsyncStorageKey.USERINFO);
    return request(
      url,
      data,
      injectBearer(JSON.parse(token).accessToken, configs),
    );
  } catch (error) {
    console.log('error', error);
    Toast.showWithGravity('Lỗi hệ thống.', Toast.LONG, Toast.BOTTOM);
  }
};

export const privateRequestWithToken = async (
  request,
  url,
  data,
  token,
  configs,
) => {
  try {
    return request(url, data, injectBearer(token, configs));
  } catch (error) {
    Toast.showWithGravity('Lỗi hệ thống.', Toast.LONG, Toast.BOTTOM);
  }
};

export const BASE_URL = create({
  baseURL: BASE_API_URL,
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Language': 'VI',
  },
});

BASE_URL.addAsyncResponseTransform(async response => {
  let { status, data } = response;
  if (status) {
    if (status && (status < 200 || status >= 300)) {
      if (status == 401) {
        //If token expired, call to API to get a new token and refresh token
        const user = await AsyncStorage.getItem(AsyncStorageKey.USERINFO);
        const refreshToken = JSON.parse(user).refreshToken;
        const accessToken = JSON.parse(user).accessToken;
        const responseJson = await privateRequestWithToken(
          BASE_URL.post,
          '/api/token/refresh',
          {},
          refreshToken,
        );
        let rootStore = require('../context/root_context');
        if (responseJson?.status == 200) {
          rootStore?.rootStore?.userStore.storeUserInfo(
            new UserInfo({
              ...user,
              access_token: responseJson.data.access_token,
              refresh_token: responseJson.data.refresh_token,
            }),
          );

          const refreshResponse = await privateRequestWithToken(
            BASE_URL[response.config.method],
            response.config.url,
            response.params,
            responseJson.data.access_token,
          );
          //Re-assign expried response with new one
          Object.assign(response, refreshResponse);
        } else {
          if (!response.config.url.includes('/api/token/refresh')) {
            const refreshResponse = await privateRequestWithToken(
              BASE_URL[response.config.method],
              response.config.url,
              response.params,
              accessToken,
            );
            //Re-assign expried response with new one
            Object.assign(response, refreshResponse);
          }
          // This else is used in case refresh token api goes wrong, but it will never happend, so i commented it
          // If token expired, and can not get new refresh token, redirect user to the login screen
          // if (!response.config.url.includes('/api/token/refresh')) {
          //   // DO NOT DELETE this require, it's for avoid Cyclic dependency returns empty object in React Native
          //   // Link to this article: https://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
          //   let rootStore = require('../context/root_context');
          //   AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
          //     rootStore.rootStore.userStore.removeSuccess(value);
          //   });
          // }
        }
      }
    } else {
      return Promise.resolve({
        ...data,
      });
    }
  }
});

export const login = async (name, password, fb_token) => {
  try {
    const path = '/api/login';
    const params = !fb_token
      ? {
          name,
          password,
        }
      : {
          name: '',
          password: '',
          provider_access_token: fb_token,
          provider_name: 'facebook',
        };
    return await BASE_URL.post(path, params);
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};

export const logout = async () => {
  try {
    const user = await AsyncStorage.getItem(AsyncStorageKey.USERINFO);
    const refreshToken = JSON.parse(user).refreshToken;
    const path = '/api/logout';
    return await privateRequestWithToken(BASE_URL.post, path, {}, refreshToken);
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};

export const uploadImage = async (path, pathToImageOnFilesystem, name) => {
  try {
    const data = new FormData();
    data.append('cover', {
      name: `diijam${getRandomNumber()}.jpg`,
      uri: pathToImageOnFilesystem,
      type: 'image/jpg',
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'multipart/form-data',
    };

    return await privateRequest(BASE_URL.post, path, data, { headers });
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};
