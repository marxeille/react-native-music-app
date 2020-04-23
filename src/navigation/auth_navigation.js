import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogInComponent from '../ui/auth/log_in_component';
import SignUpComponent from '../ui/auth/sign_up_component';
import ForgorComponent from '../ui/auth/forgot_component';
import Welcome from '../ui/auth/welcome_component';
import ForgotComponent from '../ui/auth/forgot_component';
const Stack = createStackNavigator();

export default function authContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="sign-in" component={LogInComponent} />
      <Stack.Screen name="sign-up" component={SignUpComponent} />
      <Stack.Screen name="forgot" component={ForgotComponent} />
    </Stack.Navigator>
  );
}
