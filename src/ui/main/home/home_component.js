import React, { Component } from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { wrap } from '../../../themes';
import { ScrollView } from 'react-native-gesture-handler';

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
    this.state = {};
  }

  async componentDidMount() {
    rootStore.homeStore.fetchData();
  }

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
            <TouchableOpacity cls="pt4 pb2" onPress={() => navigate('setting')}>
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
                      style={{ color: '#9166cc', fontFamily: 'lato-heavy' }}>
                      text fix cứng
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <ScrollView
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={false}>
              <HomeListComponent
                cate="1"
                type={'small'}
                data={[...rootStore?.homeStore?.popularSongs]}
                title="Mới phát gần đây"
              />
              <HomeListComponent
                cate="1"
                type={'small'}
                data={[...rootStore?.homeStore?.popularSongs]}
                title="Bài hát phổ biến"
              />
              <HomeListComponent
                type={'large'}
                title="Playlist phổ biến"
                data={[...rootStore?.homeStore?.popular]}
                cate="2"
              />
              <HomeListComponent
                type={'large'}
                data={[...rootStore?.homeStore?.popular]}
                title="Dành cho bạn"
                cate="3"
              />
            </ScrollView>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
