import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';
import { subLongStr } from '../../../../utils';
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
    return (
      <>
        <TouchableOpacity
          onPress={() => navigate('artist_detail', { artist: item })}>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
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

            <View cls="pl2">
              <Text cls="white fw7 f6 pl2 lightFont">
                {subLongStr(item?.getName(), 20) ?? ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
