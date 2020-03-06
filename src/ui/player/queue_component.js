import React, { Component } from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { getStatusBarHeight, isSmallDevice } from '../../utils';

@observer
@wrap
class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground cls="fullView aic" source={Images.bg}>
        <View cls="pa2" style={{ marginTop: getStatusBarHeight() }}>
          <View cls="aic jcc flx-row">
            <Image cls="mr2" source={Images.ic_down} />
            <Image source={Images.ic_menu} />
          </View>
          <Text cls="white"> queue_component </Text>
        </View>
      </ImageBackground>
    );
  }
}

export default Queue;
