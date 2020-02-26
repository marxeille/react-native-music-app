import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import { RootStore } from '../../data/repository/root_store';
import { RootContext } from '../../data/context/root_context';
import UserInfo from '../../data/model/user_info';

@wrap
export default class SignInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = RootContext;

  render() {
    let value: RootStore = this.context;
    console.log('DEBUG => sign_in_component value', value);

    return (
      <View>
        <Button
          title="SignIn"
          onPress={() => {
            value.userStore.storeUserInfo(
              new UserInfo({
                name: 'Đặng Ngọc Đức',
                uid: '121212',
                accessToken: '121212',
                refreshToken: '343434',
              }),
            );
          }}
        />
      </View>
    );
  }
}
