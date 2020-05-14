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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import { login } from '../../data/datasource/api_config';
import { RootContext } from '../../data/context/root_context';
import UserInfo from '../../data/model/user_info';
import Images from '../../assets/icons/icons';
import { navigate, pop } from '../../navigation/navigation_service';
import { observer } from 'mobx-react';
import { isSmallDevice } from '../../utils';
const FBSDK = require('react-native-fbsdk');
const { LoginManager, AccessToken } = FBSDK;
import Toast from 'react-native-simple-toast';

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

    if (response?.status == 200) {
      value.userStore.storeUserInfo(
        new UserInfo({
          name: loginName,
          uid: loginName,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        }),
      );
    } else {
      Toast.showWithGravity(
        'Đăng nhập không thành công, vui lòng thử lại.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  handleForgot = () => {
    navigate('forgot-pass');
  };

  handleSignUp = () => {
    navigate('sign-up');
  };

  handleLoginWithFacebook = () => {
    let value = this.context;
    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          Toast.showWithGravity('Đã huỷ', Toast.LONG, Toast.BOTTOM);
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
              Toast.showWithGravity(
                'Đăng nhập không thành công, vui lòng thử lại.',
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          });
        }
      },
      function(error) {
        // alert('Login failed with error: ' + error);
        Toast.showWithGravity(
          'Đăng nhập thất bại: ' + error,
          Toast.LONG,
          Toast.BOTTOM,
        );
      },
    );
  };

  handleLoginWithGoogle = () => {};

  render() {
    const { pass, loginName } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#291048', '#1a0732', '#130727', '#110426']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <KeyboardAvoidingView behavior="padding">
            <View cls="fullView">
              <ImageBackground
                cls="fullView aic jcsb"
                source={Images.default_wave_bg}>
                <View cls={`asfs pa3 ${isSmallDevice() ? 'pt3' : 'pt4'} pb0`}>
                  <TouchableOpacity onPress={pop} cls="mt2">
                    <Image
                      cls={`${
                        isSmallDevice()
                          ? 'widthFn-10 heightFn-18'
                          : 'widthFn-14 heightFn-24'
                      }`}
                      style={styles.iconBack}
                      source={Images.ic_back_white}
                    />
                  </TouchableOpacity>
                </View>

                <View cls="fullWidth aic jcc">
                  <View
                    cls={`fullWidth ${
                      isSmallDevice() ? 'pl3 pr3 pt4' : 'pa4 pb3'
                    }`}>
                    <Image
                      cls={`fullWidth asc aic ${
                        isSmallDevice() ? 'heightFn-60' : 'heightFn-100'
                      }`}
                      source={Images.wave}
                    />
                    <View cls="aic asc" style={{ position: 'absolute' }}>
                      <Image
                        style={styles.icon}
                        resizeMode={'contain'}
                        source={Images.new_logo}
                      />
                    </View>
                  </View>
                  {/* Text Input group */}
                  <View cls="fullWidth pt4 pl3 pr3">
                    <LinearGradient
                      colors={['#4E357A', '#9069A0', '#D39DC5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      cls={`${isSmallDevice() ? 'mb2 mt2' : 'mb3'}`}
                      style={{
                        borderRadius: 10,
                        height: isSmallDevice() ? 52 : 57,
                        padding: 1,
                      }}>
                      <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                        <TextInput
                          secureTextEntry={false}
                          placeholderTextColor="#fff"
                          placeholder={'Tên Đăng Nhập'}
                          cls={`${isSmallDevice() ? 'f10' : ''}`}
                          style={[styles.inputText]}
                          value={loginName}
                          onChange={event =>
                            this.onChangeText(event, 'loginName')
                          }
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
                      cls={`${isSmallDevice() ? 'mt2' : 'mt3'}`}
                      style={{
                        borderRadius: 10,
                        height: isSmallDevice() ? 52 : 57,
                        padding: 1,
                      }}>
                      <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                        <TextInput
                          secureTextEntry={true}
                          placeholderTextColor="#fff"
                          placeholder={'Mật Khẩu'}
                          cls={`${isSmallDevice() ? 'f10' : ''}`}
                          style={[styles.inputText]}
                          value={pass}
                          onChange={event => this.onChangeText(event, 'pass')}
                          autoCorrect={false}
                        />
                        <Image
                          cls="widthFn-25 heightFn-25"
                          source={Images.pass}
                        />
                      </View>
                    </LinearGradient>
                  </View>
                  <View
                    cls={`${
                      isSmallDevice() ? 'pl3 pr4 pb4 pt2' : 'pl3 pr4 pb4 pt3'
                    } asfs`}>
                    <TouchableWithoutFeedback onPress={this.handleForgot}>
                      <View cls="pl3">
                        <Text
                          cls="ml3"
                          style={{
                            color: '#9166cc',
                            fontFamily: 'lato-regular',
                          }}
                          cls={`${isSmallDevice() ? 'f10' : 'f8'}`}>
                          Quên mật khẩu?
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  {/* Button Group */}
                  <View
                    cls={`${
                      isSmallDevice()
                        ? 'fullWidth pa3 pt3 pb0 aic'
                        : 'fullWidth pa3 pt3 pb0 aic'
                    }`}>
                    <TouchableOpacity onPress={this.handleLogin}>
                      <LinearGradient
                        cls={`ba br5 b--#321A54 ${
                          isSmallDevice()
                            ? 'widthFn-160 heightFn-40'
                            : 'widthFn-220 heightFn-50'
                        } aic jcc`}
                        colors={['#4A3278', '#8B659D', '#DDA5CB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Text
                          cls={`white ${
                            isSmallDevice() ? 'f8' : 'f6'
                          } avertaFont`}>
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
                      cls={`${isSmallDevice() ? 'f10' : 'f8'} asc aic ml2 mr2`}
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

                  <View cls="fullWidth pa3 pt0 mt1 aic">
                    <View cls="pt3">
                      <TouchableOpacity onPress={this.handleLoginWithFacebook}>
                        <View
                          cls={`ba b--#321A54 bg-#323277 br5 ${
                            isSmallDevice()
                              ? 'widthFn-160 heightFn-40'
                              : 'widthFn-220 heightFn-50'
                          } aic jcc`}>
                          <Text
                            cls={`${
                              isSmallDevice() ? 'f8' : 'f6'
                            } white avertaFont`}>
                            Facebook
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View />
              </ImageBackground>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  iconBack: { width: 16, height: 29 },
  icon: {
    width: isSmallDevice() ? 140 : 180,
    height: isSmallDevice() ? 80 : 110,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: '#4B3277',
    borderRadius: 10,
    flexDirection: 'row',
    height: isSmallDevice() ? 50 : 55,
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
