
import React from 'react';
import { UserStore, AuthState } from '../repository/user_store';
import { RootStore } from '../repository/root_store'
import { AppState } from 'react-native';

const userStore = new UserStore(AuthState.AUTHED);
export const rootStore = new RootStore(userStore);
export const RootContext = React.createContext(
  rootStore
);