import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import { navigate, pop } from '../../../navigation/navigation_service';
import { rootStore, RootContext } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import LinearGradientText from '../library/components/LinearGradientText';
import { getStatusBarHeight, D_WIDTH } from '../../../utils';
import ListItem from '../../components/playlist_menu_concept/list_item';

@observer
@wrap
class Settings extends Component {
  static contextType = RootContext;
  constructor(props) {
    super(props);
    this.settingItems = [
      {
        title: 'Tài khoản',
        action: () => {},
        icon: Images.ic_account,
      },
      {
        title: 'Tuỳ chỉnh âm thanh',
        action: () => {},
        icon: Images.ic_sound,
      },
      {
        title: 'Tuỳ chỉnh thông báo',
        action: () => {},
        icon: Images.ic_ring,
      },
      {
        title: 'Giúp đỡ',
        action: () => {},
        icon: Images.ic_question,
      },
      {
        title: 'Đánh giá ứng dụng',
        action: () => {},
        icon: Images.ic_thump_up,
      },
      {
        title: 'Thông tin ứng dụng',
        action: () => {},
        icon: Images.ic_info,
      },
    ];
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
                <Image cls="widthFn-22 heightFn-13" source={Images.ic_down} />
              </View>
            </TouchableOpacity>
          </View>
          <View cls="aic jcc flexFn-5">
            <LinearGradientText
              text={`Cài đặt`}
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

  renderSettingItem = wrap(item => {
    return <ListItem item={item.item} />;
  });

  render() {
    return (
      <LinearGradient
        colors={['#291048', '#1f0d36', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView aic" source={Images.bg3}>
            <View cls="fullView">
              {this.renderHeader()}
              <View>
                <View cls="pt4">
                  <Image
                    cls="widthFn-150 heightFn-150 asc"
                    source={rootStore.userStore?.avatar ?? Images.bAAlbum}
                  />
                  <View style={styles.abs}>
                    <Image
                      resizeMode="contain"
                      cls="heightFn-50"
                      style={{ width: D_WIDTH }}
                      source={Images.sNg}
                    />
                  </View>
                </View>
              </View>
              <View cls="aic jcc pt3 pb2">
                <Text cls="avertaFont white f3">
                  {rootStore.userStore?.name}
                </Text>
              </View>
              <View cls="fullWidth">
                <FlatList
                  data={this.settingItems}
                  renderItem={this.renderSettingItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
            <View style={styles.fixedBottom} cls="aic">
              <TouchableOpacity
                onPress={() => {
                  rootStore?.playerStore?.clearSong();
                  rootStore?.libraryStore?.clearLibraryData();
                  this.context.userStore.removeUserInfo();
                }}
                cls="jcc pv1 ph3 aic">
                <View
                  cls="br5 ba pa1 pl3 pr3"
                  style={{ borderColor: '#d29dc5' }}>
                  <Text cls="white lightFont">Đăng xuất</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}

export default Settings;
const styles = StyleSheet.create({
  fixedBottom: {
    position: 'absolute',
    bottom: 30,
  },
  abs: {
    position: 'absolute',
    bottom: 20,
    zIndex: -999,
  },
});
