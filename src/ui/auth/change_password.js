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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import { RootContext, rootStore } from '../../data/context/root_context';
import Images from '../../assets/icons/icons';
import { observer } from 'mobx-react';
import { pop } from '../../navigation/navigation_service';
import { apiService } from '../../data/context/api_context';
import { isSmallDevice } from '../../utils';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorageKey } from '../../constant/constant';

@observer
@wrap
export default class ChangePassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      pass: '',
      rePass: '',
    };
  }

  static contextType = RootContext;

  onChangeText(event, name) {
    let value = {};
    value[name] = event.nativeEvent.text.toLowerCase();

    this.setState(value);
  }

  handleChangePass = async () => {
    const { oldPass, pass, rePass } = this.state;
    if (rootStore.userStore?.social)
      return Toast.showWithGravity(
        'Không thể đổi mật khẩu nếu bạn đăng nhập bằng Facebook',
        Toast.LONG,
        Toast.BOTTOM,
      );
    if (pass !== rePass)
      return Toast.showWithGravity(
        'Mật khẩu phải giống nhau',
        Toast.LONG,
        Toast.BOTTOM,
      );
    const response = await apiService.commonApiService.changePass(
      oldPass,
      pass,
      rootStore.userStore?.id,
    );

    if (response.status == 201) {
      Toast.showWithGravity(
        'Đổi mật khẩu thành công, vui lòng đăng nhập lại',
        Toast.LONG,
        Toast.BOTTOM,
      );
      AsyncStorage.removeItem(AsyncStorageKey.USERINFO).then(value => {
        rootStore.userStore?.removeSuccess(value);
      });
    } else {
      Toast.showWithGravity(
        'Đổi mật khẩu thất bại, vui lòng thử lại',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  render() {
    const { pass, oldPass, rePass } = this.state;
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
                  <View cls="fullWidth pa3 pb3 pt4">
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
                          secureTextEntry={true}
                          placeholderTextColor="#fff"
                          placeholder={'Mật khẩu cũ'}
                          cls={`${isSmallDevice() ? 'f10' : ''}`}
                          style={[styles.inputText]}
                          value={oldPass}
                          onChange={event =>
                            this.onChangeText(event, 'oldPass')
                          }
                          autoCorrect={false}
                        />
                        <Image
                          cls="widthFn-25 heightFn-25"
                          source={Images.pass}
                        />
                      </View>
                    </LinearGradient>
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
                          secureTextEntry={true}
                          placeholderTextColor="#fff"
                          placeholder={'Mật khẩu mới'}
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
                    <LinearGradient
                      colors={['#4E357A', '#9069A0', '#D39DC5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      cls={`${isSmallDevice() ? 'mt2' : ''}`}
                      style={{
                        borderRadius: 10,
                        height: isSmallDevice() ? 52 : 57,
                        padding: 1,
                      }}>
                      <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                        <TextInput
                          secureTextEntry={true}
                          placeholderTextColor="#fff"
                          placeholder={'Nhập lại mật khẩu mới'}
                          cls={`${isSmallDevice() ? 'f10' : ''}`}
                          style={[styles.inputText]}
                          value={rePass}
                          onChange={event => this.onChangeText(event, 'rePass')}
                          autoCorrect={false}
                        />
                        <Image
                          cls="widthFn-25 heightFn-25"
                          source={Images.pass}
                        />
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Button Group */}
                  <View
                    cls={`${
                      isSmallDevice()
                        ? 'fullWidth pa3 pt3 pb0 aic'
                        : 'fullWidth pa3 pt3 pb0 aic'
                    }`}>
                    <TouchableOpacity onPress={this.handleChangePass}>
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
                          Đổi mật khẩu
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
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
  checkBoxStyle: { flex: 1, padding: 10 },
  rightTextStyle: { color: '#fff', fontFamily: 'lato-heavy' },
  regisButton: {
    paddingVertical: 12,
    paddingHorizontal: 72,
  },
});
