import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeComponent from '../ui/main/home';
import SearchComponent from '../ui/main/search';
import LibraryComponent from '../ui/main/library';
import PlayerComponent from '../ui/player/player_component';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stylesIcons = StyleSheet.create({
  stretch: {
    width: 24,
    height: 24,
    resizeMode: 'stretch',
  },
});

function getBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: '#4b3562',
        inactiveBackgroundColor: '#4b3562',
        inactiveTintColor: '#835db8',
        activeTintColor: '#FFF',
      }}>
      <Tab.Screen
        name="home"
        component={HomeComponent}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: props => (
            <Image
              style={[stylesIcons.stretch, { tintColor: props.color }]}
              source={require('../assets/icons/tabs/logo.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchComponent}
        options={{
          tabBarLabel: 'Tìm kiếm',
          tabBarIcon: props => (
            <Image
              style={[stylesIcons.stretch, { tintColor: props.color }]}
              source={require('../assets/icons/tabs/ic_search.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="library"
        component={LibraryComponent}
        options={{
          tabBarLabel: 'Thư viện',
          tabBarIcon: props => (
            <Image
              style={[stylesIcons.stretch, { tintColor: props.color }]}
              source={require('../assets/icons/tabs/ic_library.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function mainContainer() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#4b3562',
      }}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="bottomtab" component={getBottomTabNavigator} />
        <Stack.Screen name="player" component={PlayerComponent} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
