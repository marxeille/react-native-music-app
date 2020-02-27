import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeComponent from '../ui/main/home';
import SearchComponent from '../ui/main/search';
import LibraryComponent from '../ui/main/library';
import PlayerComponent from '../ui/player/player_component';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function getBottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeComponent} />
      <Tab.Screen name="search" component={SearchComponent} />
      <Tab.Screen name="library" component={LibraryComponent} />
    </Tab.Navigator>
  );
}

export default function mainContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="bottomtab" component={getBottomTabNavigator} />
      <Stack.Screen name="player" component={PlayerComponent} />
    </Stack.Navigator>
  );
}
