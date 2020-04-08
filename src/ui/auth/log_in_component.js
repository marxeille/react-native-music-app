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
import { navigate } from '../../navigation/navigation_service';
import { observer } from 'mobx-react';

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
      Alert.alert(response.data.msg);
      // Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  handleSignUp = () => {
    navigate('sign-up');
  };

  handleLoginWithFacebook = () => {};

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
              <View cls="pa4 pb4">
                <Image style={styles.icon} source={Images.logo_signin} />
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
                  <Image source={Images.ic_pass} />
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
                    <Image cls="widthFn-20 heightFn-25" source={Images.pass} />
                  </View>
                </View>
              </View>

              {/* Button Group */}
              <ImageBackground cls="fullWidth" source={Images.wave}>
                <View cls="fullWidth pa3 pb0 aic">
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
              </ImageBackground>

              <View cls="fullWidth pa5 pt0 aic">
                <View cls="pt3">
                  <TouchableOpacity>
                    <View cls="aic ba b--#321A54 pt3 bg-#323277 br5 widthFn-220 heightFn-50">
                      <Text cls="white latoHeavyFont">
                        Đăng Nhập bằng Facebook
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View cls="pt3">
                  <TouchableOpacity>
                    <View cls="aic ba b--#321A54 pt3 bg-#A52222 br5 widthFn-220 heightFn-50">
                      <Text cls="white latoHeavyFont">
                        Đăng Nhập bằng Google
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View cls="pt3">
                  <TouchableOpacity onPress={this.handleSignUp}>
                    <LinearGradient
                      cls="ba br5 b--#321A54"
                      colors={['#4A3278', '#8B659D', '#DDA5CB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Text
                        cls="white f6 avertaFont"
                        style={styles.regisButton}>
                        Đăng Ký
                      </Text>
                    </LinearGradient>
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
