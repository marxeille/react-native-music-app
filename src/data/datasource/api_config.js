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
    // const params = {
    //   limit,
    //   offset,
    // };
    return await privateRequest(BASE_URL.get, path, {});
  } catch (error) {
    console.log('TCL: try -> error', error);
  }
};

// export const getTenantInfos = async (limit, offset) => {
//   try {
//     const path = '/v1.0/tenant/lease/lease-tenant-info/find';
//     const params = {
//       limit,
//       offset,
//       includedInfos: ['ASSET_INFO', 'UNIT_INFO'],
//     };
//     return await privateRequest(BASE_URL.post, path, params);
//   } catch (error) {
//     console.log('TCL: try -> error', error);
//   }
// };

// export const getAttributeUnit = async idUnit => {
//   try {
//     const path = `/v1.0/tenant/unit/${idUnit}/attribute`;
//     return await privateRequest(BASE_URL.get, path, {});
//   } catch (error) {
//     console.log('TCL: try -> error', error);
//   }
// };
