import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { subLongStr, isSmallDevice } from '../../../../utils';
import { navigate } from '../../../../navigation/navigation_service';
import Images from '../../../../assets/icons/icons';

@observer
@wrap
export default class AlbumItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    let width = Dimensions.get('screen').width / 3 - 16;

    return (
      <TouchableOpacity
        onPress={() => {
          item ? navigate('album_detail', { id: item.id, item: item }) : null;
        }}>
        <View cls="pb2 pr2">
          <Image
            style={{ width: width, height: width }}
            source={
              item !== undefined &&
              item.getThumb() !== null &&
              item.getThumb() !== ''
                ? {
                    uri: item.getThumb(),
                  }
                : Images.bAAlbum
            }
          />
          <View style={{ width: width }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              cls={`${isSmallDevice() ? 'f12' : 'f10'} white fw7 lightFont`}>
              {subLongStr(item.getName(), 30)}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              cls={`${
                isSmallDevice() ? 'f13' : 'f12'
              } primaryPurple f12 pt1 lightFont`}>
              {subLongStr(item.getSubTitle(), 30)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
