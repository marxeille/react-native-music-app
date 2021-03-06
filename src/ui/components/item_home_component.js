import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import { navigate } from '../../navigation/navigation_service';
import Images from '../../assets/icons/icons';
import TextTicker from 'react-native-text-ticker';
import { subLongStr } from '../../utils';

@observer
@wrap
export default class ItemHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const item = rootStore.playlist.get(this.props.id);
    return (
      <View cls="widthFn-150 pl3 mr3 pb2">
        <Image
          cls="heightFn-150 widthFn-150"
          source={
            item?.getThumb() !== null && item?.getThumb() !== ''
              ? { uri: item?.getThumb() }
              : Images.bAAlbum
          }
        />
        <View cls="pt2">
          <Text
            cls="white pt2 fw6 lightFont"
            numberOfLines={1}
            ellipsizeMode="tail">
            {subLongStr(rootStore.playlist.get(this.props.id).getName(), 30)}
          </Text>
          <Text
            cls="primaryPurple pt1 lightFont f11"
            numberOfLines={1}
            ellipsizeMode="tail">
            {rootStore.playlist.get(this.props.id).getSubTitle() ??
              'Billie Erlish'}
          </Text>
        </View>
      </View>
    );
  }
}
