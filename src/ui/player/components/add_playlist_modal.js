import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../../data/context/root_context';
import { cloneDeep } from 'lodash';
import CreatePlaylist from '../../components/add_playlist_modal';
import { subLongStr, isSmallDevice, getStatusBarHeight } from '../../../utils';

@observer
@wrap
export default class AddPlayListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPlaylist: false,
    };
  }

  _renderItem = item => {
    if (item.item.owner_id == rootStore.userStore?.id) {
      return (
        <TouchableOpacity onPress={() => this.addTracksToPlaylist(item.item)}>
          <ActionItem item={item.item} />
        </TouchableOpacity>
      );
    }
  };

  addTracksToPlaylist = playlist => {
    const { songs } = this.props;
    const newTracks = cloneDeep(playlist.tracks);
    songs.map((song, index) => {
      newTracks.push({
        track_id: Number(song.id),
        position: [...playlist.tracks].length + index - 1,
      });
    });
    playlist = { ...playlist, tracks: newTracks };
    rootStore?.homeStore?.addTracksToPlaylist(playlist);
  };

  onClosePress = () => {
    this.setState({ createPlaylist: false });
  };

  render() {
    const { songs } = this.props;
    const { createPlaylist } = this.state;

    return createPlaylist ? (
      <CreatePlaylist
        withSongs={songs}
        onClosePress={this.onClosePress}
        _hideModal={this.onClosePress}
      />
    ) : (
      <View cls="pb7">
        <View
          cls="pv2 flx-row aic bg-#280f46"
          style={{ paddingTop: getStatusBarHeight() + 10 }}>
          <View cls="aifs jcc flx-i">
            <TouchableOpacity
              onPress={() => this.props.addPlaylist(false)}
              cls="jcc pv1 ph3 aic">
              <Image source={Images.ic_delete} />
            </TouchableOpacity>
          </View>
          <View cls="aic jcc flexFn-5 pt2">
            <LinearGradientText
              text={`Thêm vào Playlist`}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 21,
                fontWeight: '800',
              }}
            />
          </View>
          <View cls="flx-i" />
        </View>
        <View cls="aic jcc pt3">
          <TouchableOpacity
            onPress={() => {
              this.setState({ createPlaylist: true });
            }}>
            <LinearGradient
              cls="ba br5 b--#321A54"
              colors={['#4A3278', '#8B659D', '#DDA5CB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text cls="white f6 fw7 pa2 pl4 pr4">Playlist mới</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View cls="pa3 pt4 pb0 fullHeight fullWidth">
          <FlatList
            data={[...rootStore?.homeStore?.popular]}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderItem}
            numColumns={4}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const ActionItem = wrap(({ item }) => {
  const width = Dimensions.get('screen').width / 3 - 16;
  return (
    <>
      <View cls="flx-i pb3 pr2">
        <Image
          style={{ width: width, height: width }}
          source={
            item && item.getThumb() !== ''
              ? { uri: item?.getThumb() }
              : Images.bAAlbum
          }
        />

        <View cls="pt2" style={{ width: width }}>
          <Text cls={`${isSmallDevice() ? 'f12' : 'f10'} white fw7 lightFont`}>
            {subLongStr(item?.getName(), 20) ?? 'Default'}
          </Text>
          <Text
            cls={`${
              isSmallDevice() ? 'f13' : 'f12'
            } primaryPurple f12 pt1 lightFont`}>
            {`${item?.tracks.length} bài hát`}
          </Text>
        </View>
      </View>
    </>
  );
});
