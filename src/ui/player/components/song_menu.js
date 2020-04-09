import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import { rootStore } from '../../../data/context/root_context';
import AddPlayListModal from './add_playlist_modal';
import { navigate } from '../../../navigation/navigation_service';
import { subLongStr } from '../../../utils';

@observer
@wrap
export default class SongMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPlaylist: false,
    };
  }

  addPlaylist = state => {
    this.setState({ showAddPlaylist: state });
  };

  addToQueue = () => {
    const { song, _hideModal } = this.props;
    if (song.id !== rootStore?.playerStore?.currentSong?.id) {
      rootStore?.createSongRef(song);
      rootStore.queueStore.addSong(song);
    }
    if (typeof _hideModal == 'function') _hideModal();
  };

  navigateToAlbum = () => {
    const { song, _hideModal } = this.props;
    song.articleId > 0
      ? navigate('album_detail', { item: song.articleId })
      : null;
    if (typeof _hideModal == 'function') _hideModal();
  };

  navigateToArtist = () => {
    const { song, _hideModal } = this.props;
    song.artistId > 0
      ? navigate('artist_detail', { artist: song.artistId })
      : null;
    if (typeof _hideModal == 'function') _hideModal();
  };

  render() {
    const { song } = this.props;

    const { showAddPlaylist } = this.state;

    return showAddPlaylist ? (
      <View>
        <AddPlayListModal addPlaylist={this.addPlaylist} />
      </View>
    ) : (
      <>
        <View cls="aic jcc pt3 pb2">
          <ImageBackground
            cls="widthFn-283 heightFn-283 aic jcc"
            source={Images.ic_barcode}>
            <Image
              source={{
                uri:
                  song?.artwork ??
                  rootStore.playerStore?.currentSong?.getThumb(),
              }}
              cls="circleFn-185"
            />
          </ImageBackground>
          <View cls="aic jcc pt3">
            <LinearGradientText
              text={song?.getName() ?? 'Chưa xác định'}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 25,
                fontFamily: 'Averta-ExtraBold',
              }}
            />
            <Text cls="white fw5 f7 pt1 latoFont">
              {song?.getSubTitle() ?? 'Chưa rõ'}
            </Text>
          </View>
        </View>
        <View cls="pa3">
          <ActionItem
            onPress={() => this.addPlaylist(true)}
            icon={'ic_add_playlist'}
            title={'Thêm vào playlist'}
          />
          <ActionItem
            onPress={() => this.addToQueue()}
            icon={'ic_add_song'}
            title={'Thêm vào danh sách chờ'}
          />
          <ActionItem
            onPress={this.navigateToAlbum}
            icon={'ic_album'}
            title={'Xem album'}
          />
          <ActionItem
            onPress={this.navigateToArtist}
            icon={'ic_artist'}
            title={'Xem nghệ sĩ'}
          />
        </View>
      </>
    );
  }
}

const ActionItem = wrap(props => {
  return (
    <>
      <TouchableOpacity onPress={props.onPress}>
        <View cls="flx-row aic pt3 pb2">
          <Image source={Images[props.icon]} />
          <Text cls="primaryPurple pl3 fw7 f6 lightFont">{props.title}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
});
