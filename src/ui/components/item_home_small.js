import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import Images from '../../assets/icons/icons';

@observer
@wrap
export default class ItemHomeSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props.item;

    return (
      <TouchableOpacity
        onPress={() => {
          if (rootStore.playerStore?.currentSong?.id == this.props.id) {
            return this.props.navigate('player');
          }
          this.props.navigate('player', { trackId: this.props.id });
        }}>
        <View cls="widthFn-130 pl3 mr3">
          <Image
            cls="heightFn-130 widthFn-130"
            source={
              item && item.getThumb() !== ''
                ? { uri: item?.getThumb() }
                : Images.bAAlbum
            }
          />
          <Text cls="white pt2 fw6 lightFont">
            {item?.getName() ?? 'Default'}
          </Text>
          <Text cls="primaryPurple pt1 lightFont f10">
            {item?.getSubTitle() ?? 'Default'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
