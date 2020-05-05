import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import { isSmallDevice, isMeidumDevice } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { navigate } from '../../navigation/navigation_service';

@wrap
export default class WelcomeComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleLogin = () => {
    navigate('sign-in');
  };

  handleSignUp = () => {
    navigate('sign-up');
  };

  render() {
    return (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView behavior="padding">
          <View cls="fullView">
            <ImageBackground
              cls={`${
                isSmallDevice() ? 'pb2' : isMeidumDevice() ? 'pb3' : 'pb5'
              } fullView aic jcsb`}
              source={Images.bg5}>
              <View cls="fullWidth pt5 pl3">
                {/* <Image
                  cls="aifs"
                  style={styles.iconBack}
                  source={Images.ic_back_white}
                /> */}
                <Image
                  cls={`${
                    isSmallDevice()
                      ? 'widthFn-140 heightFn-80'
                      : 'widthFn-180 heightFn-110'
                  } asc`}
                  resizeMode={'contain'}
                  source={Images.new_logo}
                />
              </View>

              <View cls="fullWidth">
                <View
                  cls={`fullWidth ${
                    isSmallDevice()
                      ? 'pb0'
                      : isMeidumDevice()
                      ? 'pa5 pb2'
                      : 'pa5 pb0'
                  } pt0 aic`}>
                  <View cls={`${isSmallDevice() ? 'widthFn-160 pb3' : 'pa1'}`}>
                    <Text
                      style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                      cls={`${isSmallDevice() ? 'f11' : 'f8 pl3 pr3'} tc`}>
                      Đăng ký nghe hàng triệu bài hát và chia sẻ tức thì trên
                      điện thoại, máy tính của bạn.
                    </Text>
                  </View>
                </View>
                {/* Button Group */}
                <View
                  cls={`${
                    isSmallDevice() ? 'pt0' : 'pt3'
                  } fullWidth pa3 pb0 aic`}>
                  <TouchableOpacity onPress={this.handleSignUp}>
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
                        Đăng Ký
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View cls="fullWidth pa3 pt2 aic">
                  <View cls={`${isSmallDevice() ? 'pt1' : 'pt3'}`}>
                    <TouchableOpacity onPress={this.handleLogin}>
                      <View
                        cls={`br5 ba aic jcc ${
                          isSmallDevice() ? 'widthFn-160 heightFn-40' : ''
                        } aic jcc`}
                        style={{ borderColor: '#d29dc5' }}>
                        <Text
                          cls={`white ${
                            isSmallDevice()
                              ? 'f8 pr2 pl3 pt1 pb1'
                              : 'f6 pl5 pr5'
                          }  avertaFont`}
                          style={styles.regisButton}>
                          Đăng Nhập
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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
