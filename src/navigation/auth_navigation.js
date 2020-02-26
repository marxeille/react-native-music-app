import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogInComponent from '../ui/auth/log_in_component';
const Stack = createStackNavigator();

export default function authContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="sign-in" component={LogInComponent} />
    </Stack.Navigator>
  );
}
