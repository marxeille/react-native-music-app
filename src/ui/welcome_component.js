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
import { wrap } from '../themes';
import Images from '../assets/icons/icons';
import { navigate } from '../navigation/navigation_service';

@wrap
export default class WelcomeComponent extends Component {

    constructor(props) {
        super(props);
    }

    handleLogin = () => {
        navigate('sign-in');
    }

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
                <ImageBackground cls="fullView aic jcsb" source={Images.bg5}>
                  <View cls="fullWidth pt5 pl3">
                  <Image cls="aifs" style={styles.iconBack} source={Images.ic_back_white} />
                    <Image cls="widthFn-200 heightFn-134 asc" source={Images.logo_signin} />
                  </View>

                  <View cls="fullWidth">
                    <View cls="fullWidth pa5 pt0 aic">
                        <View cls="pa1">
                            <Text style={{color:'#9166cc', fontFamily: "lato-regular"}} cls="f8 pl3 pr3 tc">
                                Đăng ký nghe hàng triệu bài hát và chia sẻ tức thì trên điện thoại, máy tính của bạn.
                            </Text>
                        </View>
                    </View>
                    {/* Button Group */}
                    <View cls="fullWidth pa3 pt0 pb0 aic">
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
        
                    <View cls="fullWidth pa4 pt3 aic" >
                        <View cls="pt3">
                            <TouchableOpacity onPress={this.handleSignUp}>
                                <View cls="br5 ba aic flx-row" style={{ borderColor: '#d29dc5' }}>
                                    <Text
                                        cls="white f6 avertaFont"
                                        style={styles.regisButton}>
                                        Đăng Ký
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
    iconBack: {width: 16, height: 29},
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