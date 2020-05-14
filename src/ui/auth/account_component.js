import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import { wrap } from '../../themes';
import { observer } from 'mobx-react';
import Images from '../../assets/icons/icons';
import { navigate, pop } from '../../navigation/navigation_service';
import { rootStore, RootContext } from '../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import LinearGradientText from '../main/library/components/LinearGradientText';
import { getStatusBarHeight } from '../../utils';
import ListItem from '../components/playlist_menu_concept/list_item';
import { isSmallDevice } from '../../utils';

@observer
@wrap
export default class AccountComponent extends Component {
  static contextType = RootContext;
  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }

  async componentDidMount() {
    await rootStore?.userStore?.getUserInfo();
  }

  renderHeader = wrap(() => {
    return (
      <LinearGradient
        colors={['#291047', '#1a0632', '#110926', '#110926']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}>
        <View
          cls="pv2 flx-row aic"
          style={{ paddingTop: getStatusBarHeight() + 20 }}>
          <View cls="aifs jcc flx-i">
            <TouchableOpacity onPress={() => pop()} cls="jcc pv1 ph3 aic">
              <View>
                <Image
                  cls="widthFn-12 heightFn-20"
                  source={Images.ic_back_nav}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View cls="aic jcc flexFn-5">
            <LinearGradientText
              text={`Tài khoản`}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 21,
                fontWeight: '800',
              }}
            />
          </View>
          <View cls="flx-i" />
        </View>
      </LinearGradient>
    );
  });

  render() {
    return (
      <LinearGradient
        colors={['#291048', '#1f0d36', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView aic" source={Images.default_wave_bg}>
            <View cls="fullView">
              {this.renderHeader()}
              <View>
                <ImageBackground
                  cls={`${
                    isSmallDevice()
                      ? 'widthFn-120 heightFn-120'
                      : 'widthFn-150 heightFn-150'
                  } asc mt4 aic jcc`}
                  source={rootStore.userStore?.avatar ?? Images.bAAlbum}>
                  <View
                    cls="fullWidth fullHeight aic jcc bg-#000"
                    opacity={0.5}
                  />
                  <Image
                    cls="widthFn-40 heightFn-40 asc aic jcc tint-#FFF absolute"
                    source={Images.ic_insta}
                  />
                </ImageBackground>
              </View>
              <View
                cls="jcc mt3 mb2 ba br2 ml3 mr3 pa2 bg-#2C184A"
                style={{ borderColor: '#9166cc' }}>
                <View cls="aic jcc">
                  <TextInput
                    cls={`${isSmallDevice() ? 'f6' : 'f4'} avertaFont white`}
                    value={'rootStore.userStore?.name'}
                    editable={false}
                  />
                </View>
                <View cls="absolute asfe pr2">
                  <Image
                    cls={`${
                      isSmallDevice()
                        ? 'widthFn-20 heightFn-20'
                        : 'widthFn-30 heightFn-30'
                    }`}
                    source={Images.ic_insta}
                  />
                </View>
              </View>

              <View cls="fullWidth pl3 pr3 aic jcc mt4">
                <Image
                  source={Images.sNg}
                  resizeMode="stretch"
                  cls="fullWidth heightFn-30"
                />

                <View cls="widthFn-200 heightFn-30 absolute pl5 pr5 aic jcc">
                  <TouchableOpacity onPress={this.handleLogin}>
                    <LinearGradient
                      cls="ba br5 b--#321A54"
                      colors={['#38245c', '#7351a1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <View cls="aic widthFn-150 heightFn-30 jcc">
                        <Text cls="white f9 avertaFont">Diijam Miễn Phí</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View cls="pl3 pr3 aic asc tc mt4">
                <LinearGradientText
                  text={`Tận hưởng âm nhạc \n nhiều hơn với Diijam VIP`}
                  end={{ x: 0.7, y: 0 }}
                  styles={{
                    justifyContent: 'center',
                    fontSize: isSmallDevice() ? 20 : 23,
                    fontWeight: '800',
                    textAlign: 'center',
                  }}
                />
              </View>

              <View cls="fullWidth heightFn-15 pl3 pr3 mb3 mt3">
                <Image
                  source={Images.sNg}
                  resizeMode="stretch"
                  style={{ flex: 1 }}
                  cls="fullWidth heightFn-30"
                />
              </View>

              <Text
                style={{ color: '#9166cc', fontFamily: 'lato-regular' }}
                cls={`${isSmallDevice() ? 'f11' : 'f9'} pl3 pr3`}>
                Với VIP, bạn sẽ tận hưởng trọn vẹn quyền truy cập theo yêu cầu
                vào bộ sưu tập âm nhạc khổng lồ của Diijam, không có bất kỳ hạn
                chế nào. Không giới hạn, không quảng cáo, không phiền phức. Chỉ
                có đắm chìm vào âm nhạc.
              </Text>
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  fixedBottom: {
    position: 'absolute',
    bottom: 30,
  },
  abs: {
    position: 'absolute',
    bottom: 20,
  },
});
