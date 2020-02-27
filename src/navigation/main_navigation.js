import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeComponent from '../ui/main/home';
import SearchComponent from '../ui/main/search';
import LibraryComponent from '../ui/main/library';
import PlayerComponent from '../ui/player/player_component';
import { Styles } from '../styles/stylesheets';
import Images from '../assets/icons/icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function getBottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: '#835db8',
        activeTintColor: '#FFF',
        style: {
          borderWidth: 0,
          borderTopWidth: 0,
          elevation: 4,
          shadowOffset: 4,
          backgroundColor: '#1e0239',
        },
      }}>
      <Tab.Screen
        name="home"
        component={HomeComponent}
        options={{
          tabBarLabel: 'Trang chủ',

          tabBarIcon: props => (
            <Image
              style={[Styles.icon, { tintColor: props.color }]}
              source={Images.logo}
            />
          ),
          backgroundColor: '#00FFFFFFF',
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchComponent}
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
        component={LibraryComponent}
        options={{
          tabBarLabel: 'Thư viện',
          tabBarIcon: props => (
            <Image
              style={[Styles.icon, { tintColor: props.color }]}
              source={Images.ic_library}
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
