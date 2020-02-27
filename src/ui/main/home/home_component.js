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
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = wrap(item => {
    return (
      <View cls="widthFn-111 pa2">
        <Image
          cls="heightFn-111 widthFn-111"
          source={require('../../../assets/images/cover1.png')}
        />
        <Text cls="white"> Daily mix 1</Text>
      </View>
    );
  });

  render() {
    return (
      <ImageBackground
        cls="fullView aic"
        source={require('../../../assets/icons/bg.png')}>
        <View cls="fullWidth pt5 bb b--#4B3277">
          <View cls="flx-row aic jcsb">
            <Text cls="white pa3 fw5 f5">Mới phát gần đây</Text>
            <Image
              cls="widthFn-20 heightFn-20"
              source={require('../../../assets/icons/setting.png')}
            />
          </View>
          <View cls="fullWidth">
            <FlatList
              horizontal
              data={[1, 2, 3]}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
