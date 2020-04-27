import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';
import { subLongStr, isTextEmpty } from '../../../../utils';
import Images from '../../../../assets/icons/icons';
import { rootStore } from '../../../../data/context/root_context';

@observer
@wrap
export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    return (
      <>
        <View cls="flx-i pb3 pr3">
          <Image
            cls="widthFn-108 heightFn-108"
            source={
              item !== undefined && item.getThumb() !== ''
                ? {
                    uri: item.getThumb(),
                  }
                : item?.id == 0
                ? Images.ic_heart_cover
                : item && isTextEmpty(item.getThumb())
                ? Images.bAAlbum
                : require('../../../../assets/images/add_playlist.png')
            }
          />

          <View cls="pt2">
            <Text cls="white fw7 f10 lightFont">
              {item !== undefined
                ? subLongStr(item.title(), 20)
                : 'Tạo playlist'}
            </Text>
            {item !== undefined ? (
              <Text cls="primaryPurple f12 pt1 lightFont">
                {item?.id == 0 ? rootStore.userStore?.name : item.subTitle()}
              </Text>
            ) : null}
          </View>
        </View>
      </>
    );
  }
}
