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
          <View cls="fullWidth pt2 pb3 bb b--#4B3277">
            <View cls="flx-row pa3 pb3 aic jcsb">
              <Text cls="white fw5 f4">Mới phát gần đây</Text>
              <Image
                cls="widthFn-20 heightFn-20"
                source={require('../../../assets/icons/setting.png')}
              />
            </View>
            <View cls="fullWidth">
              <FlatList
                horizontal
                data={[1, 2, 3, 4]}
                renderItem={this.renderItem}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
