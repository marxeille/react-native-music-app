import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import { RootStore } from '../../data/repository/root_store';
import { login } from '../../data/datasource/api_config';
import { RootContext } from '../../data/context/root_context';
import UserInfo from '../../data/model/user_info';
import Images from '../../assets/icons/icons';
import { navigate, pop } from '../../navigation/navigation_service';
import { observer } from 'mobx-react';
const FBSDK = require('react-native-fbsdk');
const { LoginManager, AccessToken } = FBSDK;

@observer
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
    value[name] = event.nativeEvent.text.toLowerCase();

    this.setState(value);
  }

  handleLogin = async () => {
    const { loginName, pass } = this.state;
    let value = this.context;
    const response = await login(loginName, pass);

    if (response.status == 200) {
      value.userStore.storeUserInfo(
        new UserInfo({
          name: loginName,
          uid: loginName,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        }),
      );
    } else {
      Alert.alert('Đăng nhập không thành công, vui lòng thử lại.');
      // Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  handleSignUp = () => {
    navigate('sign-up');
  };

  handleLoginWithFacebook = () => {
    let value = this.context;
    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Đã huỷ');
        } else {
          AccessToken.getCurrentAccessToken().then(async data => {
            const response = await login('', '', data.accessToken.toString());

            if (response.status == 200) {
              value.userStore.storeUserInfo(
                new UserInfo({
                  name: 'facebook',
                  uid: 'facebook',
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                }),
              );
            } else {
              Alert.alert('Đăng nhập không thành công, vui lòng thử lại.');
            }
          });
        }
      },
      function(error) {
        alert('Login failed with error: ' + error);
      },
    );
  };

  handleLoginWithGoogle = () => {};

  render() {
    const { pass, loginName } = this.state;
    return (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView behavior="padding">
          <View cls="fullView">
            <ImageBackground cls="fullView aic jcc" source={Images.bg4}>
              <View cls="asfs pa3 pt4 pb0">
                <TouchableOpacity onPress={pop}>
                  <Image
                    cls="widthFn-14 heightFn-24"
                    style={styles.iconBack}
                    source={Images.ic_back_white}
                  />
                </TouchableOpacity>
              </View>
              {/* <View cls="pa4 pb4">
                <Image style={styles.icon} source={Images.logo_signin} />
              </View> */}

              <View cls="fullWidth pa4 pb4 mt4">
                <Image
                  cls="fullWidth asc aic heightFn-100"
                  source={Images.wave}
                />
                <View cls="aic asc" style={{ position: 'absolute' }}>
                  <Image style={styles.icon} source={Images.logo_signin} />
                </View>
              </View>
              {/* Text Input group */}
              <View cls="fullWidth pt4 pl3 pr3">
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  cls="mb3"
                  style={{ borderRadius: 10, height: 57, padding: 1 }}>
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
                      cls="widthFn-25 heightFn-25"
                      source={Images.ic_pass}
                    />
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  cls="mt3"
                  style={{ borderRadius: 10, height: 57, padding: 1 }}>
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
                    <Image cls="widthFn-25 heightFn-25" source={Images.pass} />
                  </View>
                </LinearGradient>
              </View>
              <View cls="fullWidth pl4 pr4 pb4 pt3">
                <View cls="pl3">
                  <Text
                    cls="ml3"
                    style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                    cls="f8">
                    Quên mật khẩu?
                  </Text>
                </View>
              </View>

              {/* Button Group */}
              <View cls="fullWidth pa3 pb0 aic mb4 mt3">
                <TouchableOpacity onPress={this.handleLogin}>
                  <LinearGradient
                    cls="ba br5 b--#321A54"
                    colors={['#4A3278', '#8B659D', '#DDA5CB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text
                      cls="white f6 pl5 pr5 avertaFont"
                      style={{
                        paddingVertical: 12,
                      }}>
                      Đăng Nhập
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View cls="fullWidth flx-row mt3">
                <Image
                  cls="aic asc"
                  source={Images.sNg}
                  style={{
                    width: Dimensions.get('window').width / 2 - 25,
                    height: 10,
                  }}
                />
                <Text
                  cls="f8 asc aic ml2 mr2"
                  style={{ color: '#9166cc', fontFamily: 'lato-regular' }}>
                  hoặc
                </Text>
                <Image
                  cls="aic asc"
                  source={Images.sNg}
                  style={{
                    width: Dimensions.get('window').width / 2,
                    height: 10,
                  }}
                />
              </View>

              <View cls="fullWidth pa5 pt0 mt4 aic">
                <View cls="pt3">
                  <TouchableOpacity onPress={this.handleLoginWithFacebook}>
                    <View cls="aic ba b--#321A54 pt3 bg-#323277 br5 widthFn-220 heightFn-50">
                      <Text cls="white latoHeavyFont f6">Facebook</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  iconBack: { width: 16, height: 29 },
  icon: { width: 160, height: 110 },
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
    fontFamily: 'lato-heavy',
    color: '#fff',
  },
  regisButton: {
    paddingVertical: 12,
    paddingHorizontal: 72,
  },
});
