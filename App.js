/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import authContainer from './src/navigation/auth_navigation'

import { createStackNavigator } from '@react-navigation/stack'
import DesignTimeComponent from './design_time_component';
import mainContainer from './src/navigation/main_navigation';
import SplashComponent from './src/ui/splash_component';
import { RootContext, rootStore } from './src/data/context/root_context';
import { AuthState } from './src/data/repository/user_store'
import { observer } from "mobx-react"

const Stack = createStackNavigator();

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    switch (rootStore.userStore.authState) {
      case AuthState.AUTHED:
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer>
              <Stack.Navigator headerMode='none'>
                <Stack.Screen name="main" component={mainContainer} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
      case AuthState.NONE:
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer>
              <Stack.Navigator headerMode='none'>
                <Stack.Screen name="splash" component={SplashComponent} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
      case AuthState.NOT_AUTH:
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer>
              <Stack.Navigator headerMode='none'>
                <Stack.Screen name="auth" component={authContainer} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
      default:
      case AuthState.NONE:
        return (
          <RootContext.Provider value={rootStore}>
            <NavigationContainer>
              <Stack.Navigator headerMode='none'>
                <Stack.Screen name="design_time" component={DesignTimeComponent} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootContext.Provider>
        );
    }
  }
}
