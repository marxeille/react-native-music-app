import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { subLongStr } from '../../../../utils';
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

    return (
      <TouchableOpacity
        onPress={() => {
          item ? navigate('album_detail', { id: item.id, item: item }) : null;
        }}>
        <View cls="pb3 pr3">
          <Image
            cls="widthFn-108 heightFn-108"
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
          <View>
            <Text cls="white fw7 f8 pt2">{subLongStr(item.title(), 8)}</Text>
            <Text cls="primaryPurple f8 pt1">
              của {subLongStr(item.subTitle(), 6)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
