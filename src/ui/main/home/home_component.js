import React, { Component } from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { wrap } from '../../../themes';
import { ScrollView } from 'react-native-gesture-handler';
import { navigate } from '../../../navigation/navigation_service';
import HomeListComponent from './components/home_list_component';
import { rootStore } from '../../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradient from 'react-native-linear-gradient';

@observer
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  async componentDidMount() {
    rootStore.homeStore.fetchData();
    rootStore.userStore.fetchUserData();
  }

  handleSettingPress = () => {
    console.log('pressed');
    navigate('setting');
  };

  render() {
    const { scrollY } = this.state;
    return rootStore.homeStore.state === 'loading' ? (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView aic jcc" source={Images.home_wave_bg}>
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
          <ImageBackground
            cls="fullView"
            style={{ zIndex: 1 }}
            source={Images.home_wave_bg}>
            <Animated.View
              style={{
                opacity: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [1, 0],
                }),
                zIndex: 2,
              }}>
              <TouchableOpacity
                cls="pt4 pb2 absolute asfe"
                style={{ zIndex: 2 }}
                onPress={this.handleSettingPress}>
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
                        source={Images.ic_setting2}
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
            </Animated.View>
            <ScrollView
              cls="pt5 mt4"
              style={{ width: '100%', zIndex: 1 }}
              contentContainerStyle={{
                paddingBottom: 70,
              }}
              onScroll={Animated.event([
                { nativeEvent: { contentOffset: { y: this.state.scrollY } } },
              ])}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}>
              {[...rootStore?.homeStore?.recentlySongs].length > 0 ? (
                <HomeListComponent
                  cate="1"
                  type={'small'}
                  data={[...rootStore?.homeStore?.recentlySongs]}
                  title="Mới phát gần đây"
                />
              ) : null}

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
              <View cls="pb2">
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
