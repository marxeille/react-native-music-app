import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { wrap } from '../../themes';
import { observer } from 'mobx-react';
import { pop } from '../../navigation/navigation_service';
import { getStatusBarHeight } from '../../utils';
import Images from '../../assets/icons/icons';
import Slider from '@react-native-community/slider';

@observer
@wrap
export default class PlayerFullComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderHeader = wrap(() => {
    return (
      <>
        <View cls="flx-row jcsa aic">
          <TouchableOpacity onPress={() => pop()}>
            <Image source={Images.ic_down} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pop()}>
            <Text cls="white fw8 f5"> Today's Top Hits </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.ic_menu} />
          </TouchableOpacity>
        </View>
      </>
    );
  });

  renderInfo = wrap(() => {
    return (
      <View>
        <View cls="flx-row jcsa aic pt5">
          <TouchableOpacity onPress={() => pop()}>
            <Image source={Images.ic_like} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pop()}>
            <Text cls="white fw8 f4 primaryPurple">Vnahey hey hey</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.ic_share} />
          </TouchableOpacity>
        </View>
        <Text cls="white pt2 asc f7">Idol khÁ bẢnH</Text>
      </View>
    );
  });

  renderPlaySection = wrap(() => {
    return (
      <View>
        <View cls="flx-row jcsa aic pt2">
          <TouchableOpacity onPress={() => {}}>
            <Image cls="widthFn-20 heightFn-20" source={Images.ic_shuffe} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image cls="widthFn-32 heightFn-32" source={Images.ic_prev} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.ic_play_large} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image cls="widthFn-32 heightFn-32" source={Images.ic_next} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image cls="widthFn-18 heightFn-18" source={Images.ic_repeat} />
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  render() {
    return (
      <View>
        <ImageBackground source={Images.bg} cls="fullView">
          <View cls="pa2" style={{ marginTop: getStatusBarHeight() }}>
            {this.renderHeader()}
            <View cls="aic pt5 fullWidth">
              <Image
                cls="widthFn-327 heightFn-327"
                source={require('../../assets/images/khabanh.png')}
              />
            </View>
            {this.renderInfo()}
            <View cls="pa3">
              <Slider
                cls="fullWidth"
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#d59fc7"
                maximumTrackTintColor="#4b3277"
                thumbImage={Images.ic_circle}
              />
            </View>
            {this.renderPlaySection()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}
