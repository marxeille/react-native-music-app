import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { observer } from 'mobx-react';
import { makeCancelable, getStatusBarHeight, subLongStr } from '../../../utils';
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

@observer
@wrap
export default class ArtistDetail extends Component {
  constructor(props) {
    super(props);
    this.viewModel = ArtistModel.create({ state: 'loading' });
    this.modalSong = React.createRef();
    this.state = {
      following:
        indexOf(
          [...rootStore?.likedArtists],
          Number(props.route.params.artist.id),
        ) >= 0,
    };
  }

  componentDidMount() {
    const { artist } = this.props.route.params;
    this.cancelablePromise = makeCancelable(
      this.viewModel.getArtistTracks(Number(artist.id)),
    );
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
    const { artist } = this.props.route.params;
    const idExist = indexOf([...rootStore?.likedArtists], Number(artist.id));
    if (type == 'like') {
      if (idExist < 0) {
        rootStore?.addLikedArtist(data);
      }
    } else {
      if (idExist >= 0) {
        rootStore?.removeLikedArtist(data);
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
    const { following } = this.state;
    this.setState({ following: !following });
    !following ? this.followArtist() : this.unfollowArtist();
  };

  renderHeaderSection = wrap(() => {
    const { artist } = this.props.route.params;

    return (
      <>
        <ImageBackground
          cls={`jcsb pa3 heightFn-300`}
          // style={{ height: '60%' }}
          source={require('../../../assets/images/khabanh2.png')}>
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
              {artist.getName().toUpperCase()}
            </Text>
            <Text cls="white f8 latoFont">
              {subLongStr(
                `Idol khÁ ${artist.getName()} bẢnH is on top of the Vinahey hey hey!`,
                50,
              )}
            </Text>
            <Text cls="f9 primaryPurple latoFont pt2">{`2020 - ${this.viewModel.songs.size} Songs`}</Text>
          </View>
        </ImageBackground>
      </>
    );
  });

  renderMiddleSection = wrap(() => {
    const { following } = this.state;
    return (
      <>
        <View cls="pb3">
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
              <TouchableOpacity onPress={this.handleLogin}>
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

  _renderListHeaderContent = wrap(() => {
    return (
      <>
        {this.renderHeaderSection()}
        {this.renderMiddleSection()}
      </>
    );
  });

  _renderItem = wrap(item => {
    return (
      <View cls="pa3 pt0">
        <ArtistItem
          index={item.index}
          item={item.item}
          openModal={this._showModal}
        />
      </View>
    );
  });

  render() {
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
            <BottomModal ref={this.modalSong} headerNone>
              <SongMenu song={this.viewModel?.selectedSong} />
            </BottomModal>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
