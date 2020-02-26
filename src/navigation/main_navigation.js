import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeComponent from '../ui/main/home_component';
import SearchComponent from '../ui/main/search_component';
import LibraryComponent from '../ui/main/library_component';

const Tab = createBottomTabNavigator();

export default function mainContainer() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeComponent} />
      <Tab.Screen name="Search" component={SearchComponent} />
      <Tab.Screen name="Library" component={LibraryComponent} />
    </Tab.Navigator>
  );
}
