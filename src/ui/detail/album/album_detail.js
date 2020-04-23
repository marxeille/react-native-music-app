import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react';
import {
  makeCancelable,
  getStatusBarHeight,
  isTextEmpty,
  D_WIDTH,
} from '../../../utils';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { rootStore } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import AlbumItem from './components/album_item';
import SongMenu from '../../player/components/song_menu';
import BottomModal from '../../components/modal/BottomModal';
import { AlbumModel } from './model/AlbumModel';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import { indexOf, orderBy, findIndex, isEmpty } from 'lodash';
import Loading from '../../components/loading';
import { navigate } from '../../../navigation/navigation_service';
import MenuConcept from '../../components/playlist_menu_concept';
import { apiService } from '../../../data/context/api_context';

@observer
@wrap
export default class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.modalSong = React.createRef();
    this.modalPlaylist = React.createRef();
    this.viewModel = AlbumModel.create({ state: 'loading', stats: 0 });
    this.settingItems = [
      {
        title: 'Đổi ảnh bìa',
        action: () => {},
        icon: Images.ic_pic,
        imgStyle: 'widthFn-20 heightFn-18',
      },
      {
        title: 'Đổi tên',
        action: () => {},
        icon: Images.ic_pen,
      },
      {
        title: 'Sửa playlist',
        action: () => {
          this.setState({ showMenuEdit: true });
        },
        icon: Images.ic_list,
      },
      {
        title: 'Public playlist',
        action: () => {
          this.editPlaylist();
        },
        icon: Images.ic_lock,
        imgStyle: 'widthFn-17 heightFn-20',
      },
      {
        title: 'Xoá playlist',
        action: async () => {
          const { item } = this.props.route?.params;

          const response = await apiService.trackApiService.deletePlaylist(
            typeof item == 'number' ? item : item.id,
          );
          if (response.status == 200) {
            Alert.alert('Xoá thành công');
            rootStore.homeStore?.removePlaylist(
              typeof item == 'number' ? item : item.id,
            );
            rootStore.libraryStore?.removePlaylist(
              typeof item == 'number' ? item : item.id,
            );
            this.props.navigation.goBack();
          } else {
            Alert.alert('Vui lòng thử lại');
          }
        },
        icon: Images.ic_circle_minus,
      },
    ];
    this.state = {
      download: false,
      article: {},
      ids: [],
      showMenuEdit: false,
      playing: false,
      following:
        indexOf(
          [...this.viewModel?.likedPlaylist],
          Number(props.route.params.item.id),
        ) >= 0,
    };
  }

  async componentDidMount() {
    let { item } = this.props.route?.params;
    if (typeof item == 'number') {
      await this.viewModel.getItemDetail(item);
      item = rootStore?.albums.get(item);
      this.setState({ article: item });
    }

    this.setState({
      playing: rootStore.playlistSongStore?.id == item.id,
    });

    this.getTracks(item);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    let { item } = this.props.route?.params;
    const nextId = nextProps.route?.params.item;

    if ((typeof item == 'number' && item !== nextId) || item.id !== nextId) {
      await this.viewModel.getItemDetail(nextId);
      item = rootStore?.albums.get(nextId);
      this.setState({ article: item });
    }

    this.getTracks(item);
  }

  editPlaylist = () => {
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }
  };

  changeShowMenuEdit = state => {
    this.setState({ showMenuEdit: state });
  };

  getTracks = item => {
    let ids = orderBy([...item.tracks.values()], ['position', 'asc']).map(
      track => track.track_id,
    );

    this.cancelablePromise = makeCancelable(
      this.viewModel.getStats(item.getType(), item.id),
      this.viewModel.getLikedPlaylist(item.id),
      this.viewModel.getAlbumTracks(
        //if item.id = 0, it's liked tracks playlist, so just get the list right in the rootStore. Otherwise, it's normal playlist
        item.id == 0 ? [...rootStore?.likedTracks] : ids,
      ),
    );

    this.setState({ ids: ids });
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

  onReactionSuccess = (type, data) => {
    const { item } = this.props.route?.params;
    const idExist = indexOf(
      [...this.viewModel?.likedPlaylist],
      Number(item.id),
    );
    if (type == 'like') {
      if (idExist < 0) {
        this.viewModel?.addLikedAlbum(data);
      }
    } else {
      if (idExist >= 0) {
        this.viewModel?.removeLikedAlbum(data);
      }
    }
  };

  onReactionError = () => {
    this.setState({ following: !this.state.following });
  };

  follow = async () => {
    const { item } = this.props.route?.params;
    await likeHelper(
      'article',
      item.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  unfollow = async () => {
    const { item } = this.props.route?.params;
    await unlikeHelper(
      'article',
      item.id,
      this.onReactionSuccess,
      this.onReactionError,
    );
  };

  reaction = () => {
    const following =
      indexOf(
        [...this.viewModel?.likedPlaylist],
        Number(
          typeof this.props.route.params.item == 'number'
            ? this.props.route.params.item
            : this.props.route.params.item.id,
        ),
      ) >= 0;
    this.setState({ following: !following });
    !following ? this.follow() : this.unfollow();
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

      rootStore.playlistSongStore?.addList(ids);
      rootStore.playlistSongStore?.setPlaylist(item);
      rootStore?.queueStore?.removeSongs([
        song ? song.id.toString() : randomId.toString(),
      ]);
      this.setState({ playing: !this.state.playing });
      if (!this.state.playing) {
        if (randomId == rootStore?.playerStore?.currentSong?.id) {
          navigate('player');
        } else {
          navigate('player', { trackId: song ? song.id : randomId });
        }
        rootStore.playerStore?.setState('play');
      } else {
        rootStore.playerStore?.setState('pause');
      }
    }
  };

  addSong = () => {};

  renderHeaderSection = wrap(songs => {
    let { item } = this.props.route?.params;

    if (typeof item == 'number') {
      item = this.state.article;
    }

    const hasSong = songs.length > 0;

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
              <TouchableOpacity onPress={this._showModalPlaylist}>
                <Image source={Images.ic_menu_white} />
              </TouchableOpacity>
            </View>
            <Image
              cls="squareFn-195 asc"
              source={
                !isEmpty(item) && !isTextEmpty(item?.getThumb())
                  ? { uri: item?.getThumb() }
                  : item?.id == 0
                  ? Images.ic_heart_cover
                  : Images.bAAlbum
              }
            />

            <View cls="aic jcc pt2">
              <Text cls="white fw8 f3 pb2 avertaFont">
                {typeof item.title == 'function'
                  ? item.title().toUpperCase()
                  : '...'}
              </Text>
              {item?.id == 0 ? (
                <View cls="pb4">
                  <Text cls="f9 primaryPurple lightFont">
                    {rootStore?.userStore?.name}
                  </Text>
                </View>
              ) : (
                <>
                  <Text cls="f9 primaryPurple lightFont">
                    {`${this.viewModel.stats
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} lượt thích`}
                  </Text>
                  <Text cls="white f8 lightFont pt2 pb4">
                    {hasSong
                      ? `Idol khÁ ${
                          typeof item.subTitle == 'function'
                            ? item.getDescription()
                            : '...'
                        } bẢnH is on top of the Vinahey hey hey!`
                      : 'Hãy cùng tìm kiếm vài bài hát cho playlist của bạn'}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={{ position: 'absolute', bottom: -23 }}>
            {this.renderActionSection(item, hasSong)}
          </View>
        </ImageBackground>
      </View>
    );
  });

  renderActionSection = wrap((item, hasSong) => {
    const following =
      indexOf(
        [...this.viewModel?.likedPlaylist],
        Number(
          typeof this.props.route.params.item == 'number'
            ? this.props.route.params.item
            : this.props.route.params.item.id,
        ),
      ) >= 0;
    return (
      <ImageBackground
        style={{ width: D_WIDTH, height: 50 }}
        cls="aic jcc"
        resizeMode="contain"
        source={Images.pl_wave}>
        <View cls="flx-row">
          {hasSong || item?.id == 0 ? (
            <>
              <View cls="pa3 pr0">
                <TouchableWithoutFeedback
                  onPress={
                    rootStore.userStore.id == item.owner_id
                      ? this.addSong
                      : this.reaction
                  }>
                  {rootStore.userStore.id == item?.owner_id || item?.id == 0 ? (
                    <Image
                      cls="widthFn-50 heightFn-50"
                      source={Images.ic_btn_plus}
                    />
                  ) : (
                    <Image
                      cls="widthFn-50 heightFn-50"
                      source={
                        following ? Images.ic_btn_like : Images.ic_btn_like_on
                      }
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
              <View cls="pa3 pl0 pr0">
                <TouchableOpacity onPress={() => this.playSong()}>
                  <Image
                    resizeMode="contain"
                    cls="widthFn-150 heightFn-50"
                    source={
                      this.state.playing
                        ? Images.ic_btn_pause
                        : Images.ic_btn_play
                    }
                  />
                </TouchableOpacity>
              </View>
              <View cls="pa3 pl0">
                <TouchableWithoutFeedback onPress={() => {}}>
                  <Image
                    cls="widthFn-50 heightFn-50"
                    source={Images.ic_btn_download}
                  />
                </TouchableWithoutFeedback>
              </View>
            </>
          ) : (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.addSong();
                }}>
                <LinearGradient
                  cls="br5 b--#321A54"
                  colors={['#4A3278', '#8B659D', '#DDA5CB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text
                    cls="white f7 pl4 pr4 avertaFont"
                    style={{
                      paddingVertical: 8,
                    }}>
                    Thêm bài hát
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
      </ImageBackground>
    );
  });

  _renderListHeaderContent = wrap(songs => {
    return <>{this.renderHeaderSection(songs)}</>;
  });

  _renderItem = wrap(item => {
    return (
      <TouchableOpacity onPress={() => this.playSong(item.item)}>
        <View cls="pa3 pt0">
          <AlbumItem
            item={item.item}
            openModal={this._showModal}
            model={this.viewModel}
          />
        </View>
      </TouchableOpacity>
    );
  });

  changeOrder = orders => {
    rootStore.playlistSongStore?.addList(orders);

    const newIndex = findIndex(
      rootStore.playlistSongStore.getSongs(),
      song => song.id == rootStore.playerStore?.currentSong?.id,
    );
    rootStore.playerStore?.setTrackIndex(newIndex);
    this.setState({ ids: orders });
  };

  render() {
    let { item } = this.props.route?.params;
    let { ids } = this.state;
    if (typeof item == 'number') {
      item = this.state.article;
    }

    if (item.id == 0) {
      this.viewModel.getAlbumTracks([...rootStore?.likedTracks]);
      ids = [...rootStore?.likedTracks];
    }

    const songs = [];

    ids.map(id => {
      [...this.viewModel.songs.values()].map(song => {
        if (Number(song.id) == id) songs.push(song);
      });
    });

    return this.viewModel.state == 'loading' ? (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <Loading />
        </View>
      </LinearGradient>
    ) : (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView" source={Images.bg2}>
            <FlatList
              ListHeaderComponent={() => this._renderListHeaderContent(songs)}
              data={songs}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <BottomModal ref={this.modalSong} headerNone>
              <SongMenu
                song={this.viewModel.selectedSong}
                _hideModal={this._hideModal}
              />
            </BottomModal>
            <BottomModal
              headerNone
              justifyCenterModal
              forceInsetBottom="never"
              containerCls=""
              ref={this.modalPlaylist}>
              <MenuConcept
                item={item}
                songs={songs}
                changeOrder={this.changeOrder}
                settingItems={this.settingItems}
                showMenuEdit={this.state.showMenuEdit}
                changeShowMenuEdit={this.changeShowMenuEdit}
              />
            </BottomModal>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
