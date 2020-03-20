import { create } from 'apisauce';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const AsyncStorageKey = {
  USERINFO: '@userinfo',
};

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
    Alert.alert('Cõ lỗi xảy ra vui lòng thử lại: ');
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
  baseURL: 'http://103.28.37.44:5000/api',
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Language': 'VI',
  },
});

BASE_URL.addAsyncResponseTransform(response => {
  const { status, data } = response;

  if (status) {
    if (status && (status < 200 || status >= 300)) {
      if (status == 401) {
        //DO NOT DELETE this require, it's for avoid Cyclic dependency returns empty object in React Native
        //Link to this article: https://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
        let rootStore = require('../context/root_context');
        AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
          rootStore.rootStore.userStore.removeSuccess(value);
        });
      }
    }

    return Promise.resolve({
      ...data,
    });
  }
});

export const login = async (name, password) => {
  try {
    const path = '/login';
    const params = {
      name,
      password,
    };
    return await BASE_URL.post(path, params);
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};

export const getPlaylists = async (limit = 10, offset = 0) => {
  try {
    const path = '/playlists';
    return await privateRequest(BASE_URL.get, path, {});
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};
