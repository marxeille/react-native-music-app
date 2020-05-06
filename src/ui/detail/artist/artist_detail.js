import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { observer } from 'mobx-react';
import { makeCancelable, getStatusBarHeight, D_WIDTH } from '../../../utils';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { rootStore } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import ArtistItem from './components/artist_item';
import SongMenu from '../../player/components/song_menu';
import BottomModal from '../../components/modal/BottomModal';
import { ArtistModel } from './model/ArtistModel';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import { indexOf } from 'lodash';
import { navigate } from '../../../navigation/navigation_service';
import ArtistTabView from './components/artist_tabview';
import MenuConcept from '../../components/playlist_menu_concept';
import Toast from 'react-native-simple-toast';
import ShareModal from '../../components/share';
import AddPlayListModal from '../../player/components/add_playlist_modal';

@observer
@wrap
export default class ArtistDetail extends Component {
  constructor(props) {
    super(props);
    this.viewModel = ArtistModel.create({ state: 'loading' });
    this.modalSong = React.createRef();
    this.modalMenu = React.createRef();
    this.modalShare = React.createRef();

    this.state = {
      ids: [],
      artist: {},
      showCover: true,
      showShareModal: false,
      showAddPlaylistModal: false,
      following:
        indexOf(
          [...this.viewModel?.likedArtists],
          Number(
            typeof props.route.params.artist == 'number'
              ? props.route.params.artist
              : props.route.params.artist.id,
          ),
        ) >= 0,
    };
  }

  async componentDidMount() {
    let { artist } = this.props.route.params;

    if (typeof artist == 'number') {
      await this.viewModel.getItemDetail(artist);
      artist = rootStore?.artist.get(artist);
    }

    this.setState({ artist: artist });
    this.cancelablePromise = makeCancelable(
      this.viewModel.getArtistTracks(
        Number(typeof artist == 'number' ? artist : artist.id),
      ),
    );
    this.cancelablePromise = makeCancelable(
      this.viewModel.getStats(
        Number(typeof artist == 'number' ? artist : artist.id),
      ),
    );
    this.cancelablePromise = makeCancelable(
      this.viewModel
        .getArtistTrackIds(
          Number(typeof artist == 'number' ? artist : artist.id),
        )
        .then(ids => {
          this.setState({
            ids: ids,
          });
        }),
    );
  }

  // componentWillUnmount() {
  //   this.cancelablePromise.cancel();
  // }

  _showModal = song => {
    if (this.modalSong && this.modalSong.current) {
      this.viewModel.setSelectedSong(song);
      this.modalSong.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalSong && this.modalSong.current) {
      this.modalSong.current._hideModal();
    }
  };

  _showModalMenu = () => {
    if (this.modalMenu && this.modalMenu.current) {
      this.modalMenu.current._showModal();
    }
  };

  _hideModalMenu = () => {
    if (this.modalMenu && this.modalMenu.current) {
      this.modalMenu.current._hideModal();
    }
  };

  _showModalShare = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._showModal();
    }
  };

  _hideModalShare = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._hideModal();
    }
  };

  onReactionSuccess = (type, data) => {
    const { artist } = this.props.route.params;
    const idExist = indexOf(
      [...this.viewModel?.likedArtists],
      Number(artist.id),
    );
    if (type == 'like') {
      if (idExist < 0) {
        this.viewModel?.addLikedArtist(data);
      }
    } else {
      if (idExist >= 0) {
        this.viewModel?.removeLikedArtist(data);
      }
    }
  };

  onReactionError = () => {
    this.setState({ following: !this.state.following });
  };

  followArtist = async () => {
    const { artist } = this.props.route.params;
    await likeHelper(
      'artist',
      artist.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  unfollowArtist = async () => {
    const { artist } = this.props.route.params;
    await unlikeHelper(
      'artist',
      artist.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  reaction = () => {
    const following =
      indexOf(
        [...this.viewModel?.likedArtists],
        Number(
          typeof this.props.route.params.artist == 'number'
            ? this.props.route.params.artist
            : this.props.route.params.artist.id,
        ),
      ) >= 0;
    !following ? this.followArtist() : this.unfollowArtist();
  };

  playSong = song => {
    const { ids } = this.state;
    const { artist } = this.props.route.params;

    if (ids.length > 0) {
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      [...this.viewModel.songs.values()].map(song => {
        rootStore.createSongRef(song);
      });
      const songIdsToCreate = [];
      ids.map(id => {
        [...this.viewModel.songs.values()].map(song => {
          if (Number(song.id) == id) {
            songIdsToCreate.push(song.id);
          }
        });
      });

      rootStore.playlistSongStore?.addList(songIdsToCreate);
      rootStore.playlistSongStore?.setPlaylist(artist);
      rootStore?.queueStore?.removeSongs([
        song ? song.id.toString() : randomId.toString(),
      ]);
      if (!this.state.playing || song) {
        if (randomId == Number(rootStore?.playerStore?.currentSong?.id)) {
          navigate('player');
        } else {
          navigate('player', { trackId: song ? song.id : randomId });
        }
        rootStore.playerStore?.setState('play');
      } else {
        rootStore.playlistSongStore?.setPlaylist({});
        rootStore.playerStore?.clearSong();
        rootStore.playerStore?.setState('pause');
      }
      if (!song) {
        this.setState({ playing: !this.state.playing });
      }
    }
  };

  showArtistDetailCover = state => {
    this.setState({ showCover: state });
  };

  addToQueue = songs => {
    songs.map(song => {
      if (song.id !== rootStore?.playerStore?.currentSong?.id) {
        rootStore?.createSongRef(song);
        rootStore.queueStore.addSong(song);
      }
    });
    Toast.showWithGravity('Thêm thành công', Toast.LONG, Toast.BOTTOM);
  };

  toggleShareModal = state => {
    this.setState({ showShareModal: state });
  };

  renderHeaderSection = wrap(() => {
    let { artist, showCover } = this.state;

    return (
      <View cls="pb4">
        <ImageBackground
          resizeMode="cover"
          style={{ opacity: 0.9 }}
          blurRadius={15}
          cls={`jcsb`}
          source={Images.nN}>
          <View cls="pa3">
            <View
              cls="flx-row aic jcsb"
              style={{ paddingTop: getStatusBarHeight() }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  cls="widthFn-10 heightFn-20"
                  source={Images.ic_back_white}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._showModalMenu}>
                <Image source={Images.ic_menu_white} />
              </TouchableOpacity>
            </View>

            <View cls="aic jcc pt3">
              <Text cls="white fw8 f3 pb2 avertaFont">
                {typeof artist?.getName == 'function'
                  ? artist?.getName().toUpperCase()
                  : '...'}
              </Text>
              <Text cls="f8 white lightFont">
                {`${this.viewModel.stats
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Fans`}
              </Text>
            </View>
          </View>
          <View>
            <ArtistTabView
              artist={artist}
              showArtistDetailCover={this.showArtistDetailCover}
            />
          </View>
          {showCover ? (
            <View
              cls="asc"
              style={{ position: 'absolute', bottom: -40, zIndex: 1 }}>
              <Image
                cls="squareFn-180 asc"
                source={
                  typeof artist?.getThumb == 'function' &&
                  artist?.getThumb() !== ''
                    ? { uri: artist.getThumb() }
                    : Images.bAAlbum
                }
              />
            </View>
          ) : null}

          <View style={{ position: 'absolute', bottom: -23 }}>
            {this.renderActionSection()}
          </View>
        </ImageBackground>
      </View>
    );
  });

  renderActionSection = wrap(() => {
    return (
      <ImageBackground
        style={{ width: D_WIDTH, height: 50 }}
        cls="aic"
        resizeMode="contain"
        source={Images.pl_wave}>
        <View style={{ position: 'absolute', top: -120 }} />
      </ImageBackground>
    );
  });

  renderMiddleSection = () => {
    const following =
      indexOf(
        [...this.viewModel?.likedArtists],
        Number(
          typeof this.props.route.params.artist == 'number'
            ? this.props.route.params.artist
            : this.props.route.params.artist.id,
        ),
      ) >= 0;
    return (
      <View cls="asc">
        <View cls="flx-row aic">
          <View cls="pa3 pr0">
            <TouchableWithoutFeedback
              onPress={() => {
                this.reaction();
              }}>
              <Image
                cls="widthFn-25 heightFn-25"
                resizeMode="contain"
                source={!following ? Images.ic_like : Images.ic_like_on}
              />
            </TouchableWithoutFeedback>
          </View>
          <View cls="pa3 pl2 pr2">
            <TouchableOpacity onPress={() => this.playSong()}>
              <Image
                resizeMode="contain"
                cls="widthFn-150 heightFn-50"
                source={
                  this.state.playing ? Images.ic_btn_pause : Images.ic_btn_play
                }
              />
            </TouchableOpacity>
          </View>
          <View cls="pa3 pl0">
            <TouchableWithoutFeedback
              onPress={() => {
                this._showModalShare();
              }}>
              <Image
                cls="widthFn-25 heightFn-25"
                source={Images.ic_btn_share}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };

  _renderListHeaderContent = wrap(() => {
    return (
      <View cls="pt0">
        {this.renderHeaderSection()}
        {this.renderMiddleSection()}
      </View>
    );
  });

  _renderItem = wrap(item => {
    return (
      <TouchableOpacity onPress={() => this.playSong(item.item)}>
        <View cls="pa3 pt0">
          <ArtistItem
            index={item.index}
            item={item.item}
            model={this.viewModel}
            openModal={this._showModal}
          />
        </View>
      </TouchableOpacity>
    );
  });

  render() {
    const { artist, showShareModal, showAddPlaylistModal } = this.state;
    const settingItems = [
      {
        title: 'Tải xuống',
        action: () => {},
        hidden: false,
        icon: Images.ic_download_white,
        imgStyle: 'widthFn-20 heightFn-24',
      },
      {
        title: 'Thêm vào playlist',
        action: () => {
          this.setState({ showAddPlaylistModal: true });
        },
        hidden: false,
        icon: Images.ic_add_pl,
        imgStyle: 'widthFn-20 heightFn-24',
      },
      {
        title: 'Thêm vào danh sách chờ',
        action: () => {
          this.addToQueue([...this.viewModel.songs.values()]);
        },
        hidden: false,
        icon: Images.ic_add_queue,
        imgStyle: 'widthFn-20 heightFn-20',
      },
      {
        title: 'Chia sẻ',
        action: () => {
          this.toggleShareModal(true);
        },
        hidden: false,
        icon: Images.ic_share_white,
        imgStyle: 'widthFn-20 heightFn-24',
      },
      // {
      //   title: 'Xem nghệ sĩ',
      //   action: () => {},
      //   hidden: false,
      //   icon: Images.ic_person,
      //   imgStyle: 'widthFn-20 heightFn-24',
      // },
    ];
    return (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView" source={Images.bg3}>
            <FlatList
              ListHeaderComponent={this._renderListHeaderContent()}
              data={[...this.viewModel.songs.values()]}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <BottomModal
              headerNone
              justifyCenterModal
              // forceInsetBottom="never"
              containerCls=""
              customGradient={['#000', '#1a0632', '#000', '#13151A']}
              ref={this.modalMenu}>
              {showShareModal ? (
                <ShareModal
                  item={artist}
                  _hideModal={() => this.toggleShareModal(false)}
                />
              ) : showAddPlaylistModal ? (
                <AddPlayListModal
                  songs={[...this.viewModel.songs.values()]}
                  addPlaylist={() =>
                    this.setState({ showAddPlaylistModal: false })
                  }
                />
              ) : (
                <MenuConcept
                  item={artist}
                  settingItems={settingItems}
                  showMenuEdit={false}
                />
              )}
            </BottomModal>
            <BottomModal ref={this.modalSong} headerNone>
              <SongMenu
                song={this.viewModel?.selectedSong}
                _hideModal={this._hideModal}
              />
            </BottomModal>
            <BottomModal ref={this.modalShare} headerNone>
              <ShareModal item={artist} _hideModal={this._hideModalShare} />
            </BottomModal>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
