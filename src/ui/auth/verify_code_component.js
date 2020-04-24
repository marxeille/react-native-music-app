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
            <ImageBackground cls="fullView aic" source={Images.bg4}>
              <View cls="asfs pa3 mt4 pb0">
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
                  <Image
                    style={styles.icon}
                    resizeMode={'contain'}
                    source={Images.new_logo}
                  />
                </View>
              </View>

              <View cls="fullWidth aic pl3 pr3">
                <LinearGradientText
                  text={'Mã xác nhận'}
                  end={{ x: 0.7, y: 0 }}
                  styles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    fontFamily: 'Averta-ExtraBold',
                  }}
                />
              </View>
              <View cls="fullWidth aic pl3 pr3">
                <Text
                  style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                  cls="f8 pt1">
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
                    width: 60,
                    height: 75,
                    borderWidth: 1,
                    borderColor: '#9166cc',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                  }}
                  inputStyles={{
                    color: '#FFF',
                    fontSize: 32,
                    fontFamily: 'Averta-ExtraBold',
                  }}
                />
              </View>

              {/* Button Group */}
              <View cls="fullWidth pa3 pb0 aic mb4 mt3">
                <Text
                  style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                  cls="f8 pt1">
                  Không nhận được mã?
                </Text>
                <Text
                  style={{ color: '#FFF', fontFamily: 'lato-regular' }}
                  cls="f8 pt2">
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
  icon: { width: 180, height: 110 },
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