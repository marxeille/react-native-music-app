import React, { Component } from 'react';
import { Image, Dimensions, View, TouchableOpacity, Text } from 'react-native';
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
import { isMeidumDevice } from '../utils';
import ChangePassComponent from '../ui/auth/change_password';

const Tab = createBottomTabNavigationMusic();
const Stack = createStackNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      {state.routes.map((route, i) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const image =
          i == 0
            ? Images.ic_home
            : i == 1
            ? Images.ic_search
            : i == 2
            ? Images.ic_logo
            : null;

        const isFocused = state.index === i;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'flex-start',
              height: isMeidumDevice() ? 50 : 70,
              backgroundColor: '#1e0239',
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: 'center',
            }}
            onPress={() => {
              onPress();
            }}
            activeOpacity={1}
            accessible={false}>
            <View
              style={{
                width: '100%',
              }}>
              <View
                style={{
                  alignSelf:
                    i == 0
                      ? 'flex-start'
                      : i == 1
                      ? 'center'
                      : i == 2
                      ? 'flex-end'
                      : '',
                  justifyContent:
                    i == 0
                      ? 'flex-start'
                      : i == 1
                      ? 'center'
                      : i == 2
                      ? 'flex-end'
                      : '',
                  alignItems:
                    i == 0
                      ? 'flex-start'
                      : i == 1
                      ? 'center'
                      : i == 2
                      ? 'flex-end'
                      : '',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={[
                      Styles.icon,
                      { tintColor: i == state.index ? '#FFF' : '#835db8' },
                    ]}
                    source={image}
                  />

                  <Text
                    style={{
                      color: i == state.index ? '#FFF' : '#835db8',
                      fontSize: 11,
                      fontFamily: 'lato-heavy',
                    }}>
                    {label}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
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
        }}
      />
      <Tab.Screen
        name="search"
        component={searchContainer}
        options={{
          tabBarLabel: 'Tìm kiếm',
        }}
      />
      <Tab.Screen
        name="library"
        component={libContainer}
        options={{
          tabBarLabel: 'Thư viện',
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
