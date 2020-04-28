import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import { RootContext } from '../../data/context/root_context';
import Images from '../../assets/icons/icons';
import { pop } from '../../navigation/navigation_service';
import { observer } from 'mobx-react';
import LinearGradientText from '../main/library/components/LinearGradientText';
import { isSmallDevice } from '../../utils';

@observer
@wrap
export default class ForgotPassWordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  static contextType = RootContext;

  onChangeText(event, email) {
    let value = {};
    value[email] = event.nativeEvent.text.toLowerCase();

    this.setState(value);
  }

  render() {
    const { email } = this.state;
    return (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView behavior="padding">
          <View cls="fullView pt2">
            <ImageBackground cls="fullView aic" source={Images.bg4}>
              <View cls={`asfs pa3 ${isSmallDevice() ? 'pt3' : 'pt4'} pb0`}>
                <TouchableOpacity onPress={pop}>
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
              {/* <View cls="pa4 pb4">
                <Image style={styles.icon} source={Images.logo_signin} />
              </View> */}

              <View
                cls={`fullWidth ${
                  isSmallDevice() ? 'pl3 pr3 pt4 mt4' : 'pa4 pb4 mt4'
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

              <View
                cls={`${
                  isSmallDevice()
                    ? 'fullWidth aic pl3 pr3 mt4'
                    : 'fullWidth aic pl3 pr3'
                }`}>
                <LinearGradientText
                  text={'Quên mật khẩu'}
                  end={{ x: 0.7, y: 0 }}
                  styles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isSmallDevice() ? 26 : 30,
                    fontFamily: 'Averta-ExtraBold',
                  }}
                />
              </View>
              <View cls="fullWidth aic pl3 pr3">
                <Text
                  style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                  cls={`${isSmallDevice() ? 'f10' : 'f8'} pt1`}>
                  Hãy điền địa chỉ email của bạn. Bạn sẽ nhận được một liên kết
                  để tạo một mật khẩu mới qua email.
                </Text>
              </View>

              {/* Text Input group */}
              <View cls="fullWidth pt4 pl3 pr3">
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  cls="mb3"
                  style={{
                    borderRadius: 10,
                    height: isSmallDevice() ? 52 : 57,
                    padding: 1,
                  }}>
                  <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                    <TextInput
                      secureTextEntry={false}
                      placeholderTextColor="#fff"
                      placeholder={'Email'}
                      cls={`${isSmallDevice() ? 'f10' : ''}`}
                      style={[styles.inputText]}
                      value={email}
                      onChange={event => this.onChangeText(event, 'email')}
                      autoCorrect={false}
                    />
                    <Image
                      cls="widthFn-25 heightFn-25"
                      source={Images.ic_pass}
                    />
                  </View>
                </LinearGradient>
              </View>

              {/* Button Group */}
              <View
                cls={`${
                  isSmallDevice()
                    ? 'fullWidth pa3 pt3 pb0 aic'
                    : 'fullWidth pa3 pt0 pb0 aic'
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
                      cls={`white ${isSmallDevice() ? 'f8' : 'f6'} avertaFont`}>
                      Gửi
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
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
