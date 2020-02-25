import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import mainContainer from '../navigation/main_navigation'
const Stack = createStackNavigator();

export default AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        headerMode='none'>
        <Stack.Screen name="main" component={mainContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
};