/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import createAppContainer from './src/navigation/app_navigation';
import authContainer from './src/navigation/auth_navigation';

import { createStackNavigator } from '@react-navigation/stack';
import DesignTimeComponent from './design_time_component';
import { UserStore, AuthState } from './src/data/repository/user_store';
import { RootStore } from './src/data/repository/root_store';
import mainContainer from './src/navigation/main_navigation';

const Stack = createStackNavigator();
const userStore = new UserStore('design_time');
const rootStore = new RootStore(userStore);
const RootContext = React.createContext(rootStore);

const App = () => {
  return (
    <RootContext.Provider value={rootStore}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {rootStore.userStore.authState == 'not_auth' ? (
            <Stack.Screen name="auth" component={authContainer} />
          ) : rootStore.userStore.authState == 'auth' ? (
            <Stack.Screen name="main" component={mainContainer} />
          ) : (
            <Stack.Screen name="design_time" component={DesignTimeComponent} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </RootContext.Provider>
  );
};

export default App;
