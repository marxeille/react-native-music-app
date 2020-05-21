import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import { navigate } from '../../../../navigation/navigation_service';
import { rootStore } from '../../../../data/context/root_context';
import { subLongStr, isSmallDevice } from '../../../../utils';

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
    } else if (item.getType() == 'playlist') {
      return navigate('album_detail', { item: item });
    } else {
      model.removeRecentlySong(item?.id);
    }
  };

  handleOnItemPress = () => {
    const { item, model } = this.props;
    if (item.getType() == 'song') {
      rootStore.createSongRef(item);
      model.addRecentlySearch(item);
      rootStore?.playerStore?.setPlayFrom('Search');
      if (rootStore.playerStore?.currentSong?.id == item.id) {
        rootStore.playerStore?.prepareSong(null);
        return;
      }
      rootStore.playerStore?.prepareSong(item.id);
      return;
    } else if (item.getType() == 'artist') {
      model.addRecentlySearch(item);
      return navigate('artist_detail', { artist: item });
    } else if (item.getType() == 'playlist') {
      model.addRecentlySearch(item);
      return navigate('album_detail', { item: item });
    } else {
      model.removeRecentlySong(item?.id);
    }
  };

  render() {
    const { item, local } = this.props;

    let icon =
      item.getType() == 'song'
        ? Images.ic_menu
        : item.getType() == 'artist' || item.getType() == 'playlist'
        ? Images.ic_more
        : Images.ic_delete;

    if (local) icon = Images.ic_delete;
    return (
      <View cls="flx-row aic pt4 jcsb pr2">
        <TouchableOpacity onPress={this.handleOnItemPress}>
          <View cls="flx-row aic">
            <Image
              cls="squareFn-80"
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
              <Text
                cls="white fw7 f6 pl2"
                numberOfLines={1}
                ellipsizeMode="tail">
                {subLongStr(item?.getName(), isSmallDevice() ? 12 : 18)}
              </Text>
              <Text cls="primaryPurple f7 pl2 pt1">
                {subLongStr(item?.getSubTitle(), isSmallDevice() ? 12 : 18)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleOnActionPress}>
          <View cls="widthFn-50 heightFn-50 jcc aife">
            <Image cls="widthFn-20 heightFn-20" source={icon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
