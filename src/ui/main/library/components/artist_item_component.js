import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';
import { subLongStr, isSmallDevice } from '../../../../utils';
import Images from '../../../../assets/icons/icons';

@observer
@wrap
export default class ArtistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    let width = Dimensions.get('screen').width / 3 - 16;

    return (
      <>
        <TouchableOpacity
          onPress={() => navigate('artist_detail', { artist: item })}>
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

            <View cls="pt2" style={{ width: width }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                cls={`${isSmallDevice() ? 'f8' : 'f10'} white fw7 lightFont`}>
                {subLongStr(item?.getName(), 30) ?? ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
