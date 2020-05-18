import React, { Component } from 'react';
import { Image, Dimensions } from 'react-native';
// import {
//   createBottomTabNavigator,
//   BottomTabView,
// } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import { Styles } from '../styles/stylesheets';
import Images from '../assets/icons/icons';
import createBottomTabNavigationMusic from './createBottomTabNavigationMusic';
import homeContainer from './home_stack';
import libContainer from './library_stack';
import searchContainer from './search_stack';
import PlayerTabView from '../ui/player';
import Settings from '../ui/main/home/settings';
import ChangePassComponent from '../ui/auth/change_password';

const Tab = createBottomTabNavigationMusic();
const Stack = createStackNavigator();

function getBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: '#835db8',
        activeTintColor: '#FFF',
        labelStyle: {
          fontSize: 11,
          fontFamily: 'lato-heavy',
          paddingTop: 3,
        },
        style: {
          borderWidth: 0,
          borderTopWidth: 0,
          elevation: 4,
          shadowOffset: {
            width: 4,
            height: 4,
          },
          backgroundColor: '#1e0239',
        },
      }}>
      <Tab.Screen
        name="home_stack"
        component={homeContainer}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: props => (
            <Image
              style={[Styles.icon, { tintColor: props.color }]}
              source={Images.ic_home}
            />
          ),
          backgroundColor: '#00FFFFFFF',
        }}
      />
      <Tab.Screen
        name="search"
        component={searchContainer}
        options={{
          tabBarLabel: 'Tìm kiếm',
          tabBarIcon: props => (
            <Image
              style={[Styles.icon, { tintColor: props.color }]}
              source={Images.ic_search}
            />
          ),
        }}
      />
      <Tab.Screen
        name="library"
        component={libContainer}
        options={{
          tabBarLabel: 'Thư viện',
          tabBarIcon: props => (
            <Image
              style={[Styles.icon, { tintColor: props.color }]}
              source={Images.ic_logo}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function mainContainer() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: 'transparent',
        },
        gestureEnabled: true,
        gestureDirection: 'vertical',
        gestureResponseDistance: {
          vertical: Dimensions.get('window').height,
          horizontal: Dimensions.get('window').width,
        },
        gestureVelocityImpact: 1,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}>
      <Stack.Screen name="bottomtab" component={getBottomTabNavigator} />
      <Stack.Screen name="setting" component={Settings} />
      <Stack.Screen name="change_pass" component={ChangePassComponent} />
      <Stack.Screen
        name="player"
        component={PlayerTabView}
        options={
          {
            // headerTransparent: true,
            // gestureEnabled: false,
            // animationEnabled: true,
            // animationTypeForReplace: 'pop',
            // transitionConfig: () => ({
            //   transitionSpec: {
            //     duration: 0,
            //     timing: Animated.timing,
            //     easing: Easing.step0,
            //   },
            // }),
          }
        }
      />
    </Stack.Navigator>
  );
}
