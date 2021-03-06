/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import authContainer from './src/navigation/auth_navigation';

import { createStackNavigator } from '@react-navigation/stack';
import DesignTimeComponent from './design_time_component';
import mainContainer from './src/navigation/main_navigation';
import SplashComponent from './src/ui/splash_component';
import { RootContext, rootStore } from './src/data/context/root_context';
import { AuthState } from './src/data/repository/user_store';
import { observer, autorun } from 'mobx-react';
import { navigationRef } from './src/navigation/navigation_service';
import PlayerAudio from './src/ui/components/player/playerAudio';
import PlayerContextProvider from './src/data/context/player_context';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    StatusBar.setBarStyle('light-content');
  }

  render() {
    console.log('DEBUG => App render', rootStore.userStore.authState);
    switch (rootStore.userStore.authState) {
      case 'authed':
        return (
          <RootContext.Provider value={rootStore}>
            <PlayerContextProvider>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator headerMode="none">
                  <Stack.Screen name="main" component={mainContainer} />
                </Stack.Navigator>
              </NavigationContainer>
              <PlayerAudio />
            </PlayerContextProvider>
          </RootContext.Provider>
        );
      case 'none':
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator headerMode="none">
                <Stack.Screen name="splash" component={SplashComponent} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
      case 'not_auth':
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator headerMode="none">
                <Stack.Screen name="auth" component={authContainer} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
      default:
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator headerMode="none">
                <Stack.Screen
                  name="design_time"
                  component={DesignTimeComponent}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
    }
  }
}
