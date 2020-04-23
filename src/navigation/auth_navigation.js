import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogInComponent from '../ui/auth/log_in_component';
import SignUpComponent from '../ui/auth/sign_up_component';
import ForgorPassWordComponent from '../ui/auth/forgot_pass_component';
import Welcome from '../ui/auth/welcome_component';
import ReEnterPassWordComponent from '../ui/auth/re_enter_pass_component';
import VerifyCodeComponent from '../ui/auth/verify_code_component';
const Stack = createStackNavigator();

export default function authContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="sign-in" component={LogInComponent} />
      <Stack.Screen name="sign-up" component={SignUpComponent} />
      <Stack.Screen name="forgot-pass" component={ForgorPassWordComponent} />
      <Stack.Screen name="verify-code" component={VerifyCodeComponent} />
      <Stack.Screen name="re-enter-pass" component={ReEnterPassWordComponent} />
    </Stack.Navigator>
  );
}
