import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInComponent from '../ui/auth/sign_in_component'
const Stack = createStackNavigator();

export default function authContainer() {
  return(
    <Stack.Navigator
      headerMode='none'>
      <Stack.Screen 
        name="sign-in" 
        component={SignInComponent} />
    </Stack.Navigator>
  );
}

