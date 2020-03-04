import React, { Component } from 'react';
import { ImageBackground, ActivityIndicator, Text, View } from 'react-native';
import { navigate } from '../../../navigation/navigation_service';
import { wrap } from '../../../themes';
import { ScrollView } from 'react-native-gesture-handler';

import HomeListComponent from './components/home_list_component';
import { rootStore } from '../../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import { apiService } from '../../../data/context/api_context';

@observer
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    apiService.commonApiService.testAxios().then(value => {
      console.log("HomeComponent -> componentDidMount -> value", value)
    })
    rootStore.homeStore.fetchData();
  }

  render() {
    return rootStore.homeStore.state === 'loading' ? (
      <ImageBackground
        cls="fullView aic jcc"
        source={Images.bg}
      >
        <ActivityIndicator />
      </ImageBackground>
    ) : (
        <ImageBackground
          cls="fullView aic"
          source={Images.bg}>
          <ScrollView>
            <HomeListComponent
              cate="1"
              type={'small'}
              rightIcon
              title="Mới phát gần đây"
            />
            <HomeListComponent
              type={'large'}
              title="Playlist phổ biến"
              cate="2"
            />
            <HomeListComponent type={'large'} title="Dành cho bạn" cate="3" />
          </ScrollView>
        </ImageBackground>
      );
  }
}
