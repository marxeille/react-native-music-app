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
import { rootStore } from '../../../data/context/root_context';
import AddPlayListModal from './add_playlist_modal';
import { navigate } from '../../../navigation/navigation_service';
import { isTextEmpty, isMeidumDevice } from '../../../utils';
import { isSmallDevice } from '../../../utils';

@observer
@wrap
export default class SongMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPlaylist: false,
    };
    this.menuItems = [
      {
        title: 'Thêm vào playlist',
        icon: 'ic_add_playlist',
        action: () => {
          this.addPlaylist(true);
        },
      },
      {
        title: 'Thêm vào danh sách chờ',
        icon: 'ic_add_song',
        action: () => {
          this.addToQueue();
        },
      },
      {
        title: 'Chia sẻ',
        icon: 'ic_btn_share',
        action: () => {
          props.toggleShareMenu();
        },
      },
      {
        title: 'Thông tin album',
        icon: 'ic_album',
        action: () => {
          this.navigateToAlbum();
        },
      },
      {
        title: 'Xem nghệ sĩ',
        icon: 'ic_artist',
        action: () => {
          this.navigateToArtist();
        },
      },
    ];
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

  renderItem = ({ item }) => {
    return (
      <ActionItem onPress={item.action} title={item.title} icon={item.icon} />
    );
  };

  renderHeader = wrap(() => {
    const { song } = this.props;
    return (
      <View
        cls={`aic jcc ${
          isSmallDevice() ? 'pt2' : isMeidumDevice() ? 'pt2' : 'pt4'
        } pb2`}>
        <ImageBackground
          cls={`${
            isSmallDevice()
              ? 'widthFn-200 heightFn-200'
              : 'widthFn-260 heightFn-260'
          } aic jcc`}
          source={Images.e_cover}>
          <Image
            source={
              !isTextEmpty(song?.artwork)
                ? {
                    uri: song?.artwork,
                  }
                : Images.bAAlbum
            }
            cls={`${isSmallDevice() ? 'circleFn-80' : 'circleFn-140'}`}
          />
        </ImageBackground>
        <View cls="aic jcc pb0 pa3">
          <LinearGradientText
            text={song?.getName() ?? 'Chưa xác định'}
            end={{ x: 0.7, y: 0 }}
            styles={{
              justifyContent: 'center',
              fontSize: isSmallDevice() ? 20 : 25,
              fontFamily: 'Averta-ExtraBold',
            }}
          />
          <Text
            cls={`${
              isSmallDevice() ? 'f9' : 'f7'
            } white fw5 pt1 latoHeavyFont`}>
            {song?.getSubTitle() ?? 'Chưa rõ'}
          </Text>
        </View>
      </View>
    );
  });

  render() {
    const { showAddPlaylist } = this.state;
    return showAddPlaylist ? (
      <View>
        <AddPlayListModal
          addPlaylist={this.addPlaylist}
          songs={[this.props.song]}
        />
      </View>
    ) : (
      <View cls="pa3">
        <FlatList
          ListHeaderComponent={this.renderHeader}
          data={this.menuItems}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const ActionItem = wrap(props => {
  return (
    <>
      <TouchableOpacity onPress={props.onPress} cls="mb3">
        <View
          cls={`${
            isSmallDevice() ? 'pa1' : 'pa2'
          } br5 ba fullWidth aic flx-row`}
          style={{ borderColor: '#d29dc5' }}>
          <View cls="pl2">
            <Image
              cls={`${
                isSmallDevice()
                  ? 'widthFn-18 heightFn-18'
                  : 'widthFn-24 heightFn-24'
              } tint-#FFF`}
              source={Images[props.icon]}
            />
          </View>
          <Text cls={`white lightFont pl3`}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
});
