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
import { RootContext, rootStore } from '../../data/context/root_context';
import UserInfo from '../../data/model/user_info';
import Images from '../../assets/icons/icons';
import CheckBox from 'react-native-check-box';
import { observer } from 'mobx-react';
import { navigate, pop } from '../../navigation/navigation_service';
import { apiService } from '../../data/context/api_context';

@observer
@wrap
export default class SignUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      rePass: '',
      sex: 'male',
    };
    this.sex = ['male', 'female', 'none'];
    this.sexText = { male: 'Nam', female: 'Nữ', none: 'Khác' };
  }

  static contextType = RootContext;

  onChangeText(event, name) {
    let value = {};
    value[name] = event.nativeEvent.text.toLowerCase();

    this.setState(value);
  }

  handleSignUp = async () => {
    const { email, pass, rePass } = this.state;
    if (pass !== rePass) return Alert.alert('Mật khẩu phải giống nhau');
    const response = await apiService.commonApiService.register({
      email,
      password: pass,
    });
    if (response.status == 201) {
      Alert.alert('Đăng ký thành công, bạn có thể đăng nhập');
      pop();
    } else {
      Alert.alert('Đăng ký thất bại, vui lòng thử lại');
    }
  };

  handleLoginWithFacebook = () => {};

  renderCheckbox = sex => {
    return (
      <>
        <CheckBox
          style={styles.checkBoxStyle}
          checkBoxColor={'#4b3277'}
          onClick={() => {
            this.setState({
              sex: sex,
            });
          }}
          isChecked={this.state.sex == sex}
          rightText={this.sexText[sex]}
          rightTextStyle={styles.rightTextStyle}
          checkedImage={<Image source={Images.ic_checked} />}
        />
      </>
    );
  };

  render() {
    const { pass, email, rePass, sex } = this.state;
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
              {/* <View cls="pa4 pb3">
                <Image style={styles.icon} source={Images.logo_signin} />
              </View> */}
              <View cls="fullWidth pa4 mt4">
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
              {/* Text Input group */}
              <View cls="fullWidth pa3 pb3">
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  cls="mb4"
                  style={{ borderRadius: 10, height: 57, padding: 1 }}>
                  <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                    <TextInput
                      secureTextEntry={false}
                      placeholderTextColor="#fff"
                      placeholder={'Email'}
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
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  cls="mb4"
                  style={{ borderRadius: 10, height: 57, padding: 1 }}>
                  <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                    <TextInput
                      secureTextEntry={true}
                      placeholderTextColor="#fff"
                      placeholder={'Mật khẩu'}
                      style={[styles.inputText]}
                      value={pass}
                      onChange={event => this.onChangeText(event, 'pass')}
                      autoCorrect={false}
                    />
                    <Image cls="widthFn-25 heightFn-25" source={Images.pass} />
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#4E357A', '#9069A0', '#D39DC5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 10, height: 57, padding: 1 }}>
                  <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
                    <TextInput
                      secureTextEntry={true}
                      placeholderTextColor="#fff"
                      placeholder={'Nhập lại mật khẩu'}
                      style={[styles.inputText]}
                      value={rePass}
                      onChange={event => this.onChangeText(event, 'rePass')}
                      autoCorrect={false}
                    />
                    <Image cls="widthFn-25 heightFn-25" source={Images.pass} />
                  </View>
                </LinearGradient>
              </View>

              {/* <View cls="flx-row aic jcsb pb3 pa4 pt2">
                <Text cls="primaryPurple lightFont f8">Chọn giới tính</Text>
                {this.sex.map(s => this.renderCheckbox(s))}
              </View> */}

              {/* Button Group */}
              <View cls="fullWidth pa3 pt3 aic">
                <TouchableOpacity onPress={this.handleSignUp}>
                  <LinearGradient
                    cls="ba br5 b--#321A54"
                    colors={['#4A3278', '#8B659D', '#DDA5CB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text cls="white f6 avertaFont" style={styles.regisButton}>
                      Đăng Ký
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

              <View cls="fullWidth pa5 pt4  aic">
                <View cls="pt3">
                  <TouchableOpacity>
                    <View
                      cls="aic ba b--#321A54 bg-#323277 br5 widthFn-220 heightFn-50"
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text cls="white avertaFont f6">Facebook</Text>
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
  checkBoxStyle: { flex: 1, padding: 10 },
  rightTextStyle: { color: '#fff', fontFamily: 'lato-heavy' },
  regisButton: {
    paddingVertical: 12,
    paddingHorizontal: 72,
  },
});
