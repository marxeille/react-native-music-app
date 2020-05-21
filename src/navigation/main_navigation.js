import React, { Component, useState } from 'react';
import { Image, Dimensions, View, TouchableOpacity, Text } from 'react-native';
// import {
//   createBottomTabNavigator,
//   BottomTabView,
// } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

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
    <View style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: '#835DB8',
          height: 0.3,
        }}
      />
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const image =
            index == 0
              ? Images.ic_home
              : index == 1
              ? Images.ic_search
              : index == 2
              ? Images.ic_logo
              : null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (isFocused && index == 1) {
              // reset when click current tab
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'home' },
                    {
                      name: 'search',
                    },
                    { name: 'library' },
                  ],
                }),
              );
            } else {
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          };

          return (
            <TouchableOpacity
              key={index}
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
              activeOpacity={1}>
              <View
                style={{
                  width: '100%',
                }}>
                <View
                  style={{
                    alignSelf:
                      index == 0
                        ? 'flex-start'
                        : index == 1
                        ? 'center'
                        : index == 2
                        ? 'flex-end'
                        : '',
                    justifyContent:
                      index == 0
                        ? 'flex-start'
                        : index == 1
                        ? 'center'
                        : index == 2
                        ? 'flex-end'
                        : '',
                    alignItems:
                      index == 0
                        ? 'flex-start'
                        : index == 1
                        ? 'center'
                        : index == 2
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
                        { tintColor: isFocused ? '#FFF' : '#835db8' },
                      ]}
                      source={image}
                    />

                    <Text
                      style={{
                        color: isFocused ? '#FFF' : '#835db8',
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
    </View>
  );
}

function getBottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        key="home"
        name="home_stack"
        component={homeContainer}
        options={{
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        key="search"
        name="search"
        component={searchContainer}
        options={{
          tabBarLabel: 'Tìm kiếm',
        }}
      />
      <Tab.Screen
        key="library"
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
  const [index, setIndex] = useState(0);
  changeTab = index => {
    setIndex(index);
  };
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
        children={props => (
          <PlayerTabView {...props} changeTab={this.changeTab} />
        )}
        options={{
          headerTransparent: true,
          gestureEnabled: index == 0,
          animationEnabled: true,
          // animationTypeForReplace: 'pop',
          transitionConfig: () => ({
            transitionSpec: {
              duration: 10,
              timing: Animated.timing,
              easing: Easing.step0,
            },
          }),
        }}
      />
    </Stack.Navigator>
  );
}
