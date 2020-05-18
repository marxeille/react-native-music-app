import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import { subLongStr, isTextEmpty, isSmallDevice } from '../../../../utils';
import Images from '../../../../assets/icons/icons';
import { rootStore } from '../../../../data/context/root_context';
import { uniq } from 'lodash';

@observer
@wrap
export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    const width = Dimensions.get('screen').width / 3 - 16;
    return (
      <>
        <View cls="pb2 pr2">
          <Image
            style={{ width: width, height: width }}
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

          <View cls="pt2" style={{ width: width }}>
            <Text
              cls={`${isSmallDevice() ? 'f12' : 'f10'} white fw7 lightFont`}>
              {item !== undefined
                ? subLongStr(item.getName(), 15)
                : 'Tạo playlist'}
            </Text>
            {item !== undefined ? (
              <Text
                cls={`${
                  isSmallDevice() ? 'f13' : 'f12'
                } primaryPurple f12 pt1 lightFont`}>
                {item?.id == 0
                  ? `${uniq([...rootStore.likedTracks]).length} bài hát`
                  : item?.owner_id == rootStore?.userStore.id
                  ? rootStore.userStore?.name
                  : item.getSubTitle()}
              </Text>
            ) : null}
          </View>
        </View>
      </>
    );
  }
}
