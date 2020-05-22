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
import { getStatusBarHeight, D_WIDTH, isSmallDevice } from '../../../utils';
import ListItem from '../../components/playlist_menu_concept/list_item';
import Toast from 'react-native-simple-toast';
import { logout } from '../../../data/datasource/api_config';

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
      {
        title: 'Đổi mật khẩu',
        action: () => {
          navigate('change_pass');
        },
        icon: Images.ic_lock,
        imgStyle: 'widthFn-18 heightFn-20',
      },
    ];
    this.state = {
      info: {},
    };
  }

  async componentDidMount() {
    await rootStore?.userStore?.getUserInfo();
  }

  handleLogout = async () => {
    rootStore?.playerStore?.clearSong();
    rootStore?.homeStore?.clearHomeData();
    rootStore?.libraryStore?.clearLibraryData();
    rootStore?.historyStore.clearHistory();
    this.context.userStore.removeUserInfo();
    logout();
  };

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
              <View cls="widthFn-50 heightFn-50 jcc">
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

  renderListHeader = wrap(() => {
    return (
      <View>
        <View cls="pt4">
          <Image
            cls={`${
              isSmallDevice()
                ? 'widthFn-100 heightFn-100'
                : 'widthFn-150 heightFn-150'
            } asc`}
            source={rootStore.userStore?.avatar ?? Images.bAAlbum}
          />
          <View style={styles.abs}>
            <Image
              resizeMode="stretch"
              cls={`${isSmallDevice() ? 'heightFn-25' : 'heightFn-50'}`}
              style={{ width: D_WIDTH }}
              source={Images.sNg}
            />
          </View>
        </View>
        <View cls="aic jcc pt3 pb2">
          <Text cls={`${isSmallDevice() ? 'f5' : 'f3'} avertaFont white`}>
            {rootStore.userStore?.name}
          </Text>
        </View>
      </View>
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
            <View cls="fullView" style={{ flex: 3 }}>
              {this.renderHeader()}
              <View
                cls="flx-i"
                style={{ marginBottom: isSmallDevice() ? 60 : 70 }}>
                <FlatList
                  ListHeaderComponent={this.renderListHeader}
                  data={this.settingItems}
                  renderItem={this.renderSettingItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
            <View style={styles.fixedBottom} cls="aic">
              <TouchableOpacity
                onPress={this.handleLogout}
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
    bottom: isSmallDevice() ? 20 : 30,
  },
  abs: {
    position: 'absolute',
    bottom: 20,
    zIndex: -999,
  },
});
