import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import { navigate } from '../../../../navigation/navigation_service';
import { rootStore } from '../../../../data/context/root_context';
import { subLongStr } from '../../../../utils';

@wrap
export default class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnActionPress = () => {
    const { item, model, _showModal, local } = this.props;
    if (local) {
      model.removeLocalData(item.getType(), item?.id);
      return;
    }
    if (item.getType() == 'song') {
      if (typeof _showModal == 'function') _showModal(item);
      return;
    } else if (item.getType() == 'artist') {
      return navigate('artist_detail', { artist: item });
    } else {
      model.removeRecentlySong(item?.id);
    }
  };

  handleOnItemPress = () => {
    const { item, model } = this.props;
    if (item.getType() == 'song') {
      rootStore.createSongRef(item);
      model.addRecentlySong(item);
      return navigate('player', { trackId: item.id });
    } else if (item.getType() == 'artist') {
      model.addRecentlyArtist(item);
      return navigate('artist_detail', { artist: item });
    } else {
      model.removeRecentlySong(item?.id);
    }
  };

  render() {
    const { item, local } = this.props;

    let icon =
      item.getType() == 'song'
        ? Images.ic_menu
        : item.getType() == 'artist'
        ? Images.ic_more
        : Images.ic_delete;

    if (local) icon = Images.ic_delete;
    return (
      <View cls="flx-row aic pt4 jcsb">
        <TouchableOpacity onPress={this.handleOnItemPress}>
          <View cls="flx-row aic">
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
            <View>
              <Text cls="white fw7 f6 pl2">
                {subLongStr(item?.getName(), 20)}
              </Text>
              <Text cls="primaryPurple f7 pl2 pt1">{item?.getSubTitle()}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleOnActionPress}>
          <Image cls="widthFn-20 heightFn-20" source={icon} />
        </TouchableOpacity>
      </View>
    );
  }
}
