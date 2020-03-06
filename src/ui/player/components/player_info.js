import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { wrap } from '../../../themes';
import { isSmallDevice } from '../../../utils';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';

@observer
@wrap
export default class PlayerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <View cls={`flx-row jcsa aic pt${isSmallDevice() ? 4 : 5}`}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={Images.ic_like} />
          </TouchableOpacity>
          <TouchableOpacity>
            <LinearGradientText
              text={rootStore.playerStore.currentSong?.getName()}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 23,
                fontWeight: '800',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.ic_share} />
          </TouchableOpacity>
        </View>
        <Text cls="white pt2 asc f7">
          Idol {rootStore.playerStore.currentSong?.getSubTitlte()} bẢnH
        </Text>
      </View>
    );
  }
}
