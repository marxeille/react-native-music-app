import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../../data/context/root_context';
import { cloneDeep } from 'lodash';
import CreatePlaylist from '../../components/add_playlist_modal';

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
    return (
      <TouchableOpacity onPress={() => this.addTracksToPlaylist(item.item)}>
        <ActionItem item={item.item} />
      </TouchableOpacity>
    );
  };

  addTracksToPlaylist = playlist => {
    const { song } = this.props;
    const newTracks = cloneDeep(playlist.tracks);
    newTracks.push({
      track_id: Number(song.id),
      position: [...playlist.tracks].length,
    });
    playlist = { ...playlist, tracks: newTracks };
    rootStore?.homeStore?.addTracksToPlaylist(playlist);
  };

  onClosePress = () => {
    this.setState({ createPlaylist: false });
  };

  render() {
    const { createPlaylist } = this.state;
    return createPlaylist ? (
      <CreatePlaylist
        onClosePress={this.onClosePress}
        _hideModal={this.onClosePress}
      />
    ) : (
      <View cls="pb8">
        <LinearGradient
          colors={['#291048', '#1f0d36', '#130727', '#110426']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View cls="pv2 flx-row aic">
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
        </LinearGradient>
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
        <View cls="pa3 pt4 pb0" style={{ height: '80%' }}>
          <FlatList
            data={[...rootStore?.homeStore?.popular]}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderItem}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const ActionItem = wrap(({ item }) => {
  return (
    <>
      <View cls="flx-i pb3 pr2">
        <Image
          cls="widthFn-108 heightFn-108"
          source={
            item && item.getThumb() !== ''
              ? { uri: item?.getThumb() }
              : Images.bAAlbum
          }
        />

        <View cls="pt2">
          <Text cls="white fw7 f10 lightFont">
            {' '}
            {item?.title() ?? 'Default'}
          </Text>
          <Text cls="primaryPurple f12 pt1 lightFont">
            {item?.subTitle() ?? 'Default'}
          </Text>
        </View>
      </View>
    </>
  );
});
