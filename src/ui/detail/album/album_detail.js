import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Switch,
  FlatList,
  TouchableOpacity,
} from 'react-native';
// import SongOfAlBumStore from '../../../data/repository/song_of_album_store';
import { observer } from 'mobx-react';
import { makeCancelable, getStatusBarHeight } from '../../../utils';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { rootStore } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import AlbumItem from './components/album_item';
import SongMenu from '../../player/components/song_menu';
import BottomModal from '../../components/modal/BottomModal';
import { AlbumModel } from './model/AlbumModel';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import { indexOf, orderBy } from 'lodash';
import Loading from '../../components/loading';
import { navigate } from '../../../navigation/navigation_service';

@observer
@wrap
export default class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.modalSong = React.createRef();
    this.viewModel = AlbumModel.create({ state: 'loading', stats: 0 });
    this.state = {
      download: false,
      article: {},
      ids: [],
      following:
        indexOf(
          [...rootStore?.likedAlbums],
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
    const ids = orderBy([...item.tracks.values()], ['position', 'asc']).map(
      track => track.track_id,
    );
    this.cancelablePromise = makeCancelable(
      this.viewModel.getStats(item.getType(), item.id),
      this.viewModel.getAlbumTracks(
        //if item.id = 0, it's liked tracks playlist, so just get the list right in the rootStore. Otherwise, it's normal playlist
        item.id == 0 ? [...rootStore?.likedTracks] : ids,
      ),
    );

    this.setState({ ids: ids });
  }

  componentWillUnmount() {
    this.cancelablePromise.cancel();
  }

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

  onReactionSuccess = (type, data) => {
    const { item } = this.props.route?.params;
    const idExist = indexOf([...rootStore?.likedAlbums], Number(item.id));
    if (type == 'like') {
      if (idExist < 0) {
        rootStore?.addLikedAlbum(data);
      }
    } else {
      if (idExist >= 0) {
        rootStore?.removeLikedAlbum(data);
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
    const { following } = this.state;
    this.setState({ following: !following });
    !following ? this.follow() : this.unfollow();
  };

  playRandomSong = () => {
    const { ids } = this.state;
    if (ids.length > 0) {
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      [...this.viewModel.songs.values()].map(song => {
        rootStore.createSongRef(song);
      });

      rootStore.playlistSongStore?.addList(ids);
      rootStore?.queueStore?.removeSongs([randomId.toString()]);
      navigate('player', { trackId: randomId });
    }
  };

  renderHeaderSection = wrap(() => {
    let { item } = this.props.route?.params;
    if (typeof item == 'number') {
      item = this.state.article;
    }
    return (
      <>
        <ImageBackground
          cls={`jcsb pa3 heightFn-300`}
          // style={{ height: '60%' }}
          source={{ uri: 'https://picsum.photos/300' }}>
          <View
            cls="flx-row aic jcsb"
            style={{ paddingTop: getStatusBarHeight() }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                cls="widthFn-10 heightFn-20"
                source={Images.ic_back_white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.ic_menu_white} />
            </TouchableOpacity>
          </View>
          <View cls="aic jcc">
            <Text cls="white fw8 f3 pb2 avertaFont">
              {item.title().toUpperCase()}
            </Text>
            <Text cls="white f8 latoFont">
              {`Idol khÁ ${item.subTitle()} bẢnH is on top of the Vinahey hey hey!`}
            </Text>
            <Text cls="f9 primaryPurple latoFont pt2">
              {`${this.viewModel.stats
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Người theo dõi`}
            </Text>
          </View>
        </ImageBackground>
      </>
    );
  });

  renderMiddleSection = wrap(() => {
    const { following } = this.state;
    return (
      <>
        <View>
          <View cls="pt2 aic pb2">
            <TouchableOpacity onPress={this.reaction}>
              <View
                cls={`widthFn-140 aic ba br5 pa3 pt2 pb2 ${
                  following ? ' bg-#835db8' : ''
                }`}
                style={{ borderColor: '#d7a0c8' }}>
                <Text cls="white f11 fw6 lightFont">
                  {`${following ? 'Đang' : ''} theo dõi`.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <ImageBackground
              cls="heightFn-70 aic pt3"
              style={{ width: '100%' }}
              source={Images.wave}>
              <TouchableOpacity onPress={this.playRandomSong}>
                <LinearGradient
                  cls="ba br5 b--#321A54"
                  colors={['#4A3278', '#8B659D', '#DDA5CB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text cls="white f6 fw7 pa2 pl4 pr4 avertaFont">
                    Phát trộn bài
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </>
    );
  });

  renderDownloadSection = wrap(() => {
    return (
      <>
        <View cls="pa3 pb2 pt0 fullWidth">
          <View cls="flx-row jcsb aic">
            <LinearGradientText
              text={'Tải xuống'}
              end={{ x: 0.6, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 18,
                fontFamily: 'Averta-ExtraBold',
              }}
            />
            <Switch
              value={this.state.download}
              trackColor={{ true: '#d59fc6', false: 'grey' }}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              onValueChange={value => {
                this.setState({ download: value });
              }}
            />
          </View>
        </View>
      </>
    );
  });

  _renderListHeaderContent = wrap(() => {
    return (
      <>
        {this.renderHeaderSection()}
        {this.renderMiddleSection()}
        {this.renderDownloadSection()}
      </>
    );
  });

  _renderItem = wrap(item => {
    return (
      <View cls="pa3 pt0">
        <AlbumItem item={item.item} openModal={this._showModal} />
      </View>
    );
  });

  render() {
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
              ListHeaderComponent={this._renderListHeaderContent()}
              data={[...this.viewModel.songs.values()]}
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
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
