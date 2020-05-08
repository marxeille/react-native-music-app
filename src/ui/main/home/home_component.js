import React, { Component } from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { wrap } from '../../../themes';
import { ScrollView } from 'react-native-gesture-handler';
import { navigate } from '../../../navigation/navigation_service';
import HomeListComponent from './components/home_list_component';
import { rootStore } from '../../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from '../../../utils';

@observer
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActionSettingVisible: true,
    };
  }

  async componentDidMount() {
    rootStore.homeStore.fetchData();
    rootStore.userStore.fetchUserData();
  }

  _listViewOffset = 0;

  _onScroll = event => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionSettingVisible = direction === 'up';
    if (isActionSettingVisible !== this.state.isActionSettingVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionSettingVisible });
    }
    // Update your scroll position
    this._listViewOffset = currentOffset;
  };

  render() {
    return rootStore.homeStore.state === 'loading' ? (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView aic jcc" source={Images.bg2}>
            <ActivityIndicator />
          </ImageBackground>
        </View>
      </LinearGradient>
    ) : (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView" source={Images.bg3}>
            {this.state.isActionSettingVisible ? (
              <TouchableOpacity
                cls="pt4 pb2"
                onPress={() => navigate('setting')}>
                <View cls="pa3 pb1 flx-row-reverse aic">
                  <LinearGradient
                    colors={['#4E357A', '#9069A0', '#D39DC5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ padding: 1 }}
                    cls="flx-row-reverse aic br5">
                    <View cls="flx-row-reverse aic pl2 pr2 pt1 pb1 br5 bg-#2C184A">
                      <Image
                        cls="widthFn-24 heightFn-24"
                        source={Images.ic_setting}
                      />
                      <Text
                        cls="f8 mr1"
                        style={{ color: '#fff', fontFamily: 'lato-heavy' }}>
                        {rootStore.userStore?.name}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{ height: getStatusBarHeight() }} />
            )}
            <ScrollView
              style={{ width: '100%' }}
              onScroll={this._onScroll}
              showsVerticalScrollIndicator={false}>
              <HomeListComponent
                cate="1"
                type={'small'}
                data={[...rootStore?.homeStore?.popularSongs]}
                title="Mới phát gần đây"
              />
              <View cls="pt3">
                <HomeListComponent
                  cate="1"
                  type={'small'}
                  data={[...rootStore?.homeStore?.popularSongs]}
                  title="Bài hát phổ biến"
                />
              </View>
              <View cls="pt3">
                <HomeListComponent
                  type={'large'}
                  title="Playlist phổ biến"
                  data={[...rootStore?.homeStore?.popular]}
                  cate="2"
                />
              </View>
              <View cls="pb5">
                <HomeListComponent
                  type={'large'}
                  data={[...rootStore?.homeStore?.popular]}
                  title="Dành cho bạn"
                  cate="3"
                />
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
