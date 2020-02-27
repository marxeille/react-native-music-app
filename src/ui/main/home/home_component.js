import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import { navigate } from '../../../navigation/navigation_service';
import { wrap } from '../../../themes';
import { ScrollView } from 'react-native-gesture-handler';

import HomeListComponent from './components/home_list_component';
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground
        cls="fullView aic"
        source={require('../../../assets/icons/bg.png')}>
        <ScrollView>
          <HomeListComponent
            data={[1, 2, 3, 4]}
            type={'small'}
            rightIcon
            title="Mới phát gần đây"
          />
          <HomeListComponent
            data={[1, 2, 3, 4]}
            type={'large'}
            title="Playlist phổ biến"
          />
          <HomeListComponent
            data={[1, 2, 3, 4]}
            type={'large'}
            title="Dành cho bạn"
          />
        </ScrollView>
      </ImageBackground>
    );
  }
}
