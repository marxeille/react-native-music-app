import React, { Component } from 'react';
import { ImageBackground, ActivityIndicator, Text, View } from 'react-native';
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
          <ImageBackground cls="fullView aic" source={Images.bg3}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <HomeListComponent
                cate="1"
                type={'large'}
                data={rootStore?.homeStore?.popular}
                rightIcon
                title="Mới phát gần đây"
              />
              <HomeListComponent
                cate="1"
                type={'small'}
                data={[...rootStore?.homeStore?.popularSongs]}
                title="Bài hát phổ biến"
              />
              {/* <HomeListComponent
                type={'large'}
                title="Playlist phổ biến"
                cate="2"
              />
              <HomeListComponent type={'large'} title="Dành cho bạn" cate="3" /> */}
            </ScrollView>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
