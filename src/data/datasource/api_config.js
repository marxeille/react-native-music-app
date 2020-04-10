import { create } from 'apisauce';
import { Alert } from 'react-native';
import { BASE_API_URL } from '../../constant/constant';
import AsyncStorage from '@react-native-community/async-storage';
import UserInfo from '../model/user_info';
import { AsyncStorageKey } from '../../constant/constant';

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
    // Alert.alert('Có lỗi xảy ra vui lòng thử lại: ');
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
    Alert.alert('Cõ lỗi xảy ra vui lòng thử lại: ');
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
          //  DO NOT DELETE this require, it's for avoid Cyclic dependency returns empty object in React Native
          // Link to this article: https://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
          // If token expired, and can not get new refresh token, redirect user to the login screen
          let rootStore = require('../context/root_context');
          AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
            rootStore.rootStore.userStore.removeSuccess(value);
          });
        }
      }
    } else {
      return Promise.resolve({
        ...data,
      });
    }
  }
});

export const login = async (name, password) => {
  try {
    const path = '/api/login';
    const params = {
      name,
      password,
    };
    return await BASE_URL.post(path, params);
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};
