import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { observer } from 'mobx-react';
import {
  makeCancelable,
  getStatusBarHeight,
  isTextEmpty,
} from '../../../utils';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { rootStore } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import SongMenu from '../../player/components/song_menu';
import BottomModal from '../../components/modal/BottomModal';
import { AlbumModel } from './model/AlbumModel';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import { indexOf, orderBy, findIndex, isEmpty, uniq } from 'lodash';
import Loading from '../../components/loading';
import { navigate } from '../../../navigation/navigation_service';
import MenuConcept from '../../components/playlist_menu_concept';
import { apiService } from '../../../data/context/api_context';
import ActionGroup from './components/action_group';
import AddSongPlaylist from '../../components/add_playlist_modal/add_song';
import Toast from 'react-native-simple-toast';
import AlbumListItem from './components/list_item';
import AddPlayListModal from '../../player/components/add_playlist_modal';
import ShareModal from '../../components/share';
import { uploadImage } from '../../../data/datasource/api_config';
import { BASE_API_URL } from '../../../constant/constant';
import TextTicker from 'react-native-text-ticker';
import AlbumItem from './components/album_item';

@observer
@wrap
export default class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.modalSong = React.createRef();
    this.modalPlaylist = React.createRef();
    this.modalAddSong = React.createRef();
    this.viewModel = AlbumModel.create({ state: 'loading', stats: 0 });
    this.state = {
      download: false,
      article: {},
      ids: [],
      showMenuEdit: false,
      showMenuAddToPlaylist: false,
      showShareModal: false,
      editTitle: false,
      playing: false,
      private: props.route?.params.item.private,
      cover: props.route?.params.item.thumb,
      name: props.route?.params.item.name,
    };
  }

  async componentDidMount() {
    let { item } = this.props.route?.params;

    if (typeof item == 'number' || (item && item?.tracks.length == 0)) {
      const itemId = item.id;
      await this.viewModel.getItemDetail(
        typeof item == 'number' ? item : item.id,
      );

      item = rootStore?.albums.get(
        typeof item == 'number' ? item : Number(itemId),
      );

      if (!item)
        item = rootStore?.playlist.get(
          typeof item == 'number' ? item : Number(itemId),
        );
      this.setState({ article: item });
    }

    this.setState({
      playing: rootStore.playlistSongStore?.id == item?.id,
    });

    this.getTracks(item);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    let { item } = this.props.route?.params;
    const nextId = nextProps.route?.params.item;
    if ((typeof item == 'number' && item !== nextId) || item?.id !== nextId) {
      await this.viewModel.getItemDetail(nextId);
      item = rootStore?.albums.get(nextId);

      this.setState({ article: item });
    }
    this.getTracks(item);
  }

  editPlaylist = tracks => {
    let { item } = this.props.route?.params;
    let orderedTracks = [];

    if (typeof item == 'number') {
      item = this.state.article;
    }

    if (tracks) {
      tracks.map((track, i) => {
        orderedTracks.push({
          track_id: track.id,
          position: item.tracks.length + i,
        });
      });
    }

    const newPlaylist = !tracks
      ? {
          ...item,
          private: !this.state.private,
        }
      : {
          ...item,
          tracks: [...item.tracks, ...orderedTracks],
        };

    apiService.trackApiService
      .editPlaylist(newPlaylist)
      .then(res => {
        if (res.status == 200) {
          !tracks ? this.setState({ private: res.data.private }) : null;
          rootStore.updatePlayList(res.data);
          if (tracks) {
            const orders = [];
            res.data.tracks.map(track => {
              orders.push(track.track_id);
            });
            tracks.map(t => {
              this.viewModel.setSongs(t);
            });
            rootStore.playlistSongStore?.addList(orders);
            this._hideModalAddSong();
            this.setState({ ids: orders });
          }
          Toast.showWithGravity('Sửa thành công', Toast.LONG, Toast.BOTTOM);
        } else {
          Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
        }
      })
      .catch(err => {
        console.log('AlbumDetail -> editPlaylist -> err', err);
        Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
      });
  };

  changeShowMenuEdit = state => {
    this.setState({ showMenuEdit: state });
  };

  editCover = async (playlist, response) => {
    const plCover = await uploadImage(
      `/api/playlists/${playlist.id}/cover`,
      response.uri,
      'cover',
    );

    if (plCover.status == 201) {
      rootStore.updatePlayList(plCover.data);
      this.setState({ cover: BASE_API_URL + plCover.data.cover_path });
    }
  };

  changeTitle = newTitle => {
    let { item } = this.props.route?.params;
    if (newTitle == this.state.name) {
      Toast.showWithGravity('Sửa thành công', Toast.LONG, Toast.BOTTOM);
      return;
    }
    this.setState({ name: newTitle });
    const newName = {
      ...item,
      name: newTitle,
    };

    apiService.trackApiService
      .editPlaylist(newName)
      .then(res => {
        if (res.status == 200) {
          rootStore.updatePlayList(res.data);
          Toast.showWithGravity('Sửa thành công', Toast.LONG, Toast.BOTTOM);
        } else {
          Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
        }
      })
      .catch(err => {
        console.log('AlbumDetail -> editPlaylist -> err', err);
        Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
      });
  };

  showEditTitle = show => {
    this.setState({ editTitle: show });
  };

  getTracks = item => {
    console.log('ite', item);
    if (item) {
      let ids = orderBy([...item?.tracks.values()], ['position', 'asc']).map(
        track => track.track_id,
      );

      this.cancelablePromise = makeCancelable(
        this.viewModel.getStats(item?.getType(), item.id),
        this.viewModel.getLikedPlaylist(item.id),
        this.viewModel.getAlbumTracks(
          //if item.id = 0, it's liked tracks playlist, so just get the list right in the rootStore. Otherwise, it's normal playlist
          item.id == 0 ? [...rootStore?.likedTracks] : ids,
        ),
      );

      this.setState({ ids: ids });
    }
  };

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

  _showModalPlaylist = () => {
    if (this.modalPlaylist && this.modalPlaylist.current) {
      this.modalPlaylist.current._showModal();
    }
  };

  _hideModalPlaylist = () => {
    if (this.modalPlaylist && this.modalPlaylist.current) {
      this.modalPlaylist.current._hideModal();
    }
  };

  _showModalAddSong = () => {
    if (this.modalAddSong && this.modalAddSong.current) {
      this.modalAddSong.current._showModal();
    }
  };

  _hideModalAddSong = () => {
    if (this.modalAddSong && this.modalAddSong.current) {
      this.modalAddSong.current._hideModal();
    }
  };

  onReactionSuccess = (type, data) => {
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }
    const idExist = indexOf(
      [...this.viewModel?.likedPlaylist],
      Number(item.id),
    );

    if (type == 'like') {
      if (idExist < 0) {
        if (item?.getType() == 'playlist') {
          rootStore?.updatePlayList({ ...item, tracks: [] });
          this.viewModel?.addLikedPlaylist(data);
          rootStore?.libraryStore?.updatePlayList(data);
        } else {
          rootStore?.updateAlbum(item);
          this.viewModel?.addLikedAlbum(data);
          rootStore?.libraryStore?.updateAlbum(data);
        }
      }
    } else {
      if (idExist >= 0) {
        if (item?.getType() == 'playlist') {
          this.viewModel?.removeLikedPlaylist(data);
          rootStore?.libraryStore?.removePlaylist(data);
        } else {
          this.viewModel?.removeLikedAlbum(data);
          rootStore?.libraryStore?.removeAlbum(data);
        }
      }
    }
  };

  onReactionError = () => {};

  follow = async () => {
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }
    await likeHelper(
      item?.getType(),
      item?.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  unfollow = async () => {
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }
    await unlikeHelper(
      item?.getType(),
      item?.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  reaction = state => {
    !state ? this.follow() : this.unfollow();
  };

  playSong = song => {
    const { ids } = this.state;
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }

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
      rootStore.playlistSongStore?.setPlaylist(item);
      rootStore?.queueStore?.removeSongs([
        song ? song.id.toString() : randomId.toString(),
      ]);
      if (!this.state.playing || song) {
        if (
          Number(randomId) == Number(rootStore?.playerStore?.currentSong?.id) &&
          !song
        ) {
          navigate('player');
        } else {
          if (
            Number(song?.id) !== Number(rootStore?.playerStore?.currentSong?.id)
          ) {
            navigate('player', {
              trackId: song ? song.id : randomId,
            });
          } else {
            navigate('player');
          }
        }
        rootStore?.playerStore?.setPlayFrom(item?.name ?? 'Album');
        rootStore.playerStore?.setState('play');
      } else {
        rootStore.playlistSongStore?.setPlaylist({});
        rootStore.playerStore?.clearSong();
        rootStore.playerStore?.setState('pause');
      }
      if (!song) {
        this.setState({ playing: !this.state.playing });
      } else {
        this.setState({ playing: true });
      }
    }
  };

  addSong = () => {
    this._showModalAddSong();
  };

  renderHeaderSection = wrap((hasSong, item, name, following, songs) => {
    return (
      <View cls="pb5">
        <ImageBackground
          cls={`jcsb`}
          resizeMode="cover"
          style={{ opacity: 0.9 }}
          blurRadius={15}
          source={
            !isEmpty(item) && !isTextEmpty(item?.getThumb()) && hasSong
              ? { uri: item?.getThumb() }
              : Images.nN
          }>
          <ImageBackground
            cls={`jcsb`}
            style={{ opacity: 0.9 }}
            resizeMode="cover"
            source={Images.bNgEn}>
            <View cls="pa3">
              <View
                cls="flx-row aic jcsb"
                style={{ paddingTop: getStatusBarHeight() + 10 }}>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.goBack()}>
                  <View cls="widthFn-50 heightFn-50 jcc">
                    <Image
                      cls="widthFn-10 heightFn-20"
                      source={Images.ic_back_white}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this._showModalPlaylist}>
                  <View cls="widthFn-50 heightFn-50 aic jcc">
                    <Image source={Images.ic_menu_white} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {typeof item?.getType == 'function' &&
              item?.getType() != 'playlist' ? (
                <Image
                  cls="squareFn-197 asc"
                  source={
                    !isEmpty(item) && !isTextEmpty(item?.getThumb())
                      ? { uri: item?.getThumb() }
                      : item?.id == 0
                      ? Images.ic_heart_cover
                      : Images.bAAlbum
                  }
                />
              ) : (
                <View cls="asc">
                  <View cls="flx-row">
                    <Image
                      cls="squareFn-98"
                      source={
                        !isTextEmpty(
                          songs[0] && typeof songs[0]?.getThumb == 'function'
                            ? songs[0]?.getThumb()
                            : '',
                        ) && hasSong
                          ? {
                              uri: songs[0]?.getThumb(),
                            }
                          : Images.bAAlbum
                      }
                    />
                    <View cls="heightFn-98 widthFn-2 bg-#000" />
                    <Image
                      cls="squareFn-98"
                      source={
                        !isTextEmpty(
                          songs[1] && typeof songs[1]?.getThumb == 'function'
                            ? songs[1]?.getThumb()
                            : '',
                        ) && hasSong
                          ? {
                              uri: songs[1]?.getThumb(),
                            }
                          : Images.bAAlbum
                      }
                    />
                  </View>
                  <View cls="heightFn-2 widthFn-197 bg-#000" />
                  <View cls="flx-row">
                    <Image
                      cls="squareFn-98"
                      source={
                        !isTextEmpty(
                          songs[2] && typeof songs[2]?.getThumb == 'function'
                            ? songs[2]?.getThumb()
                            : '',
                        ) && hasSong
                          ? {
                              uri: songs[2]?.getThumb(),
                            }
                          : Images.bAAlbum
                      }
                    />
                    <View cls="heightFn-98 widthFn-2 bg-#000" />
                    <Image
                      cls="squareFn-98"
                      source={
                        !isTextEmpty(
                          songs[3] && typeof songs[3]?.getThumb == 'function'
                            ? songs[3]?.getThumb()
                            : '',
                        ) && hasSong
                          ? {
                              uri: songs[3]?.getThumb(),
                            }
                          : Images.bAAlbum
                      }
                    />
                  </View>
                </View>
              )}
            </View>
            <View cls="aic jcc pa3 pt2">
              <TextTicker
                style={{ fontSize: 15 }}
                duration={14000}
                loop
                bounce
                repeatSpacer={150}
                scrollSpeed={100}
                bounceSpeed={400}
                marqueeDelay={800}>
                <Text cls="white fw8 f3 pb2 avertaFont">
                  {typeof item?.getName == 'function'
                    ? item?.getName()
                    : this.state.name != undefined &&
                      !isTextEmpty(this.state.name)
                    ? this.state.name
                    : 'Chưa xác định'}
                </Text>
              </TextTicker>

              {item?.id == 0 ? (
                <View cls="pb4">
                  <Text cls="f9 primaryPurple lightFont">
                    {rootStore?.userStore?.name}
                  </Text>
                </View>
              ) : (
                <>
                  <Text cls="f9 primaryPurple lightFont">
                    {`${
                      typeof item?.getType == 'function' &&
                      item?.getType() == 'article'
                        ? item?.getSubTitle()
                        : this.viewModel.stats
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
                          ' lượt thích'
                    } `}
                  </Text>
                  <Text cls="white f8 lightFont pt2 pb4">
                    {hasSong
                      ? `${
                          typeof item?.getDescription == 'function'
                            ? item.getDescription()
                            : '...'
                        }`
                      : 'Hãy cùng tìm kiếm vài bài hát cho playlist của bạn'}
                  </Text>
                </>
              )}
            </View>
            <View style={{ position: 'absolute', bottom: -23 }}>
              <ActionGroup
                item={item}
                playSong={this.playSong}
                playing={this.state.playing}
                followed={following}
                reaction={this.reaction}
                addSong={this.addSong}
                hasSong={hasSong}
                viewModel={this.viewModel}
              />
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  });

  deletePlaylist = async () => {
    const { item } = this.props.route?.params;

    const response = await apiService.trackApiService.deletePlaylist(
      typeof item == 'number' ? item : item.id,
    );
    if (response.status == 200) {
      Toast.showWithGravity('Xoá thành công', Toast.LONG, Toast.BOTTOM);
      rootStore.homeStore?.removePlaylist(
        typeof item == 'number' ? item : item.id,
      );
      rootStore.libraryStore?.removePlaylist(
        typeof item == 'number' ? item : item.id,
      );
      this.props.navigation.goBack();
    } else {
      Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
    }
  };

  changeOrder = orders => {
    rootStore.playlistSongStore?.addList(orders);

    const newIndex = findIndex(
      rootStore.playlistSongStore.getSongs(),
      song => song.id == rootStore.playerStore?.currentSong?.id,
    );
    rootStore.playerStore?.setTrackIndex(newIndex);
    this.setState({ ids: orders });
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

  handleLoadMore = () => {
    console.log('load moreeee');
  };

  renderItem = wrap(item => {
    return (
      <View cls="pa3 pt0">
        <AlbumItem
          playSong={this.playSong}
          item={item.item}
          openModal={this._showModal}
          model={this.viewModel}
        />
      </View>
    );
  });

  render() {
    let { item } = this.props.route?.params;
    let {
      ids,
      showMenuAddToPlaylist,
      showShareModal,
      name,
      editTitle,
      showMenuEdit,
    } = this.state;
    if (typeof item == 'number') {
      item = this.state.article;
    }

    const following =
      indexOf(
        typeof item?.getType == 'function' && item?.getType() == 'playlist'
          ? [...this.viewModel?.likedPlaylist]
          : [...this.viewModel?.likedAlbum],
        Number(item?.id),
      ) >= 0;

    if (item?.id == 0) {
      ids = [...rootStore?.likedTracks];
    }

    const songs = [];

    uniq(ids).map(id => {
      [...this.viewModel.songs.values()].map(song => {
        if (Number(song.id) == id) {
          songs.push(song);
        }
      });
    });

    const hasSong = songs.length > 0;

    const settingItems =
      item?.id == 0
        ? []
        : [
            {
              title: 'Đổi ảnh bìa',
              action: response => {
                this.editCover(item, response);
              },
              icon: Images.ic_pic,
              imgStyle: 'widthFn-20 heightFn-18',
              hidden: rootStore.userStore?.id !== item?.owner_id,
              picker: true,
            },
            {
              title: 'Đổi tên',
              action: () => {
                this.showEditTitle(true);
              },
              icon: Images.ic_pen,
              hidden: rootStore.userStore?.id !== item?.owner_id,
            },
            {
              title: 'Sửa playlist',
              action: () => {
                this.setState({ showMenuEdit: true });
              },
              icon: Images.ic_list,
              hidden: rootStore.userStore?.id !== item?.owner_id,
            },
            {
              title: `${this.state.private ? 'Public' : 'Private'} playlist`,
              action: () => {
                this.editPlaylist();
              },
              hidden: rootStore.userStore?.id !== item?.owner_id,
              icon: Images.ic_lock,
              imgStyle: 'widthFn-17 heightFn-20',
            },
            {
              title: 'Xoá playlist',
              hidden: rootStore.userStore?.id !== item.owner_id,
              action: () => this.deletePlaylist(),
              icon: Images.ic_circle_minus,
            },
            {
              title: 'Tải xuống',
              action: () => {},
              hidden: rootStore.userStore?.id == item.owner_id,
              icon: Images.ic_download_white,
              imgStyle: 'widthFn-20 heightFn-24',
            },
            {
              title: 'Thêm vào playlist',
              action: () => {
                this.setState({ showMenuAddToPlaylist: true });
              },
              hidden: rootStore.userStore?.id == item?.owner_id,
              icon: Images.ic_add_pl,
              imgStyle: 'widthFn-20 heightFn-24',
            },
            {
              title: 'Thêm vào danh sách chờ',
              action: () => {
                this.addToQueue(songs);
              },
              hidden: rootStore.userStore?.id == item?.owner_id,
              icon: Images.ic_add_queue,
              imgStyle: 'widthFn-20 heightFn-20',
            },
            {
              title: 'Chia sẻ',
              action: () => {
                this.setState({ showShareModal: true });
              },
              hidden: false,
              icon: Images.ic_share_white,
              imgStyle: 'widthFn-20 heightFn-24',
            },
            {
              title: 'Xem người tạo ra playlist',
              action: () => {},
              hidden: rootStore.userStore?.id == item?.owner_id,
              icon: Images.ic_person,
              imgStyle: 'widthFn-20 heightFn-24',
            },
          ];

    return this.viewModel.state == 'loading' ? (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView aic jcc">
          <Loading />
        </View>
      </LinearGradient>
    ) : (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView" source={Images.default_wave_bg}>
            <FlatList
              ListHeaderComponent={this.renderHeaderSection(
                hasSong,
                item,
                name,
                following,
                songs,
              )}
              data={songs}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}
              initialNumToRender={10}
            />
            <BottomModal
              forceInsetTop={'never'}
              forceInsetBottom={'never'}
              ref={this.modalSong}
              headerNone>
              {showShareModal ? (
                <ShareModal
                  item={this.viewModel.selectedSong}
                  _hideModal={() => {
                    this._hideModal();
                    this.setState({ showShareModal: false });
                  }}
                />
              ) : (
                <SongMenu
                  song={this.viewModel.selectedSong}
                  _hideModal={this._hideModal}
                  toggleShareMenu={() =>
                    this.setState({ showShareModal: true })
                  }
                />
              )}
            </BottomModal>
            <BottomModal
              headerNone
              justifyCenterModal
              forceInsetTop={'never'}
              forceInsetBottom={'never'}
              containerCls=""
              customGradient={['#000', '#1a0632', '#000', '#13151A']}
              ref={this.modalPlaylist}>
              {showMenuAddToPlaylist ? (
                <AddPlayListModal
                  songs={songs}
                  addPlaylist={() =>
                    this.setState({ showMenuAddToPlaylist: false })
                  }
                />
              ) : showShareModal ? (
                <ShareModal
                  item={item}
                  _hideModal={() => this.setState({ showShareModal: false })}
                />
              ) : (
                <MenuConcept
                  item={item}
                  title={name}
                  songs={songs}
                  _hideModal={() => {
                    this._hideModalPlaylist();
                  }}
                  likeCount={this.viewModel.stats
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  editTitle={editTitle}
                  changeOrder={this.changeOrder}
                  changeTitle={this.changeTitle.bind(this)}
                  settingItems={settingItems}
                  showMenuEdit={showMenuEdit}
                  showEditTitle={this.showEditTitle}
                  changeShowMenuEdit={this.changeShowMenuEdit}
                />
              )}
            </BottomModal>
            <BottomModal
              headerNone
              justifyCenterModal
              forceInsetTop={'never'}
              forceInsetBottom={'never'}
              containerCls=""
              ref={this.modalAddSong}>
              <AddSongPlaylist
                isFavorite={item?.id == 0}
                parentModel={this.viewModel}
                toggleAddSong={this._hideModalAddSong}
                handleRightAction={this.editPlaylist}
              />
            </BottomModal>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
