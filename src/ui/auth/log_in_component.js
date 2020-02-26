import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
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
export default class LogInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      pass: '',
    };
  }

  static contextType = RootContext;

  onChangeText(event, name) {
    let value = {};
    value[name] = event.nativeEvent.text;

    this.setState(value);
  }

  handleLogin = () => {
    let value: RootStore = this.context;
    value.userStore.storeUserInfo(
      new UserInfo({
        name: 'Đặng Ngọc Đức',
        uid: '121212',
        accessToken: '121212',
        refreshToken: '343434',
      }),
    );
  };

  handleLoginWithFacebook = () => { };

  handleLoginWithGoogle = () => { };

  render() {
    const { pass, loginName } = this.state;
    return (
      <View cls="bg-purple fullView aic jcc">
        <View cls="pa3 pb5">
          <Image
            style={styles.icon}
            source={require('../../assets/icons/logo.png')}
          />
        </View>
        {/* Text Input group */}
        <View cls="fullWidth pa4">
          <View cls="pa3 bg-#4B3277" style={[styles.inputGroup]}>
            <TextInput
              secureTextEntry={false}
              placeholderTextColor="#fff"
              placeholder={'Tên Đăng Nhập'}
              style={[styles.inputText]}
              value={loginName}
              onChange={event => this.onChangeText(event, 'loginName')}
              autoCorrect={false}
            />
            <Image
              style={{ width: 20, height: 25 }}
              source={require('../../assets/icons/login.png')}
            />
          </View>
          <View cls="pt3">
            <View cls="pa3 bg-#4B3277" style={[styles.inputGroup]}>
              <TextInput
                secureTextEntry={true}
                placeholderTextColor="#fff"
                placeholder={'Mật Khẩu'}
                style={[styles.inputText]}
                value={pass}
                onChange={event => this.onChangeText(event, 'pass')}
                autoCorrect={false}
              />
              <Image
                style={{ width: 20, height: 25 }}
                source={require('../../assets/icons/pass.png')}
              />
            </View>
          </View>
        </View>

        {/* Button Group */}
        <ImageBackground
          cls="fullWidth"
          source={require('../../assets/icons/wave.png')}>
          <View cls="fullWidth pa3 pb0 aic">
            <TouchableOpacity onPress={this.handleLogin}>
              <LinearGradient
                cls="ba br5 b--#321A54"
                colors={['#4A3278', '#8B659D', '#DDA5CB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text cls="white f6 fw5 pa3 pl5 pr5">Đăng nhập</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View cls="fullWidth pa5 pt3 aic">
          <View cls="pt3">
            <TouchableOpacity>
              <View
                cls="aic ba b--#321A54 pt3 bg-#323277 br5"
                style={{ width: 220, height: 50 }}>
                <Text cls="white">Đăng nhập bằng Facebook</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View cls="pt3">
            <TouchableOpacity>
              <View
                cls="aic ba b--#321A54 pt3 bg-#A52222 br5"
                style={{ width: 220, height: 50 }}>
                <Text cls="white">Đăng nhập bằng Google</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: { width: 160, height: 100 },
  inputGroup: {
    borderWidth: 1,
    borderColor: '#4B3277',
    borderRadius: 10,
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    marginBottom: 5,
  },
  inputText: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    color: '#fff',
  },
});
