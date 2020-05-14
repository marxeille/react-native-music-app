import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextStyle,
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
import OtpInputs from 'react-native-otp-inputs';
import { isSmallDevice } from '../../utils';

@observer
@wrap
export default class VerifyCodeComponent extends Component {
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
            <ImageBackground cls="fullView aic" source={Images.default_wave_bg}>
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
                  text={'Mã xác nhận'}
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
                  Vui lòng nhập mã xác minh được gửi tới địa chỉ email.
                </Text>
              </View>

              {/* Text Input group */}
              <View cls="fullWidth pt4 pl3 pr3 flx-row">
                <OtpInputs
                  keyboardType="phone-pad"
                  handleChange={code => console.log(code)}
                  selectTextOnFocus={true}
                  numberOfInputs={4}
                  inputContainerStyles={{
                    backgroundColor: '#2C184A',
                    width: isSmallDevice() ? 50 : 60,
                    height: isSmallDevice() ? 65 : 75,
                    borderWidth: 1,
                    borderColor: '#9166cc',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                  }}
                  inputStyles={{
                    color: '#FFF',
                    fontSize: isSmallDevice() ? 28 : 32,
                    fontFamily: 'Averta-ExtraBold',
                  }}
                />
              </View>

              {/* Button Group */}
              <View cls="fullWidth pa3 pb0 aic mb4 mt3">
                <Text
                  style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                  cls={`${isSmallDevice() ? 'f10' : 'f8'} pt1`}>
                  Không nhận được mã?
                </Text>
                <Text
                  style={{ color: '#FFF', fontFamily: 'lato-regular' }}
                  cls={`${isSmallDevice() ? 'f10' : 'f8'} pt2`}>
                  Gửi lại ngay
                </Text>
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
