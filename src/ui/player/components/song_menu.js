import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
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
import { scrollDownPosition } from '../../../constant/constant';
import Toast from 'react-native-simple-toast';
import TextTicker from 'react-native-text-ticker';

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
      Toast.showWithGravity('Thêm thành công', Toast.LONG, Toast.BOTTOM);
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
        } pb3`}>
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
          {/* <LinearGradientText
            text={song?.getName() ?? 'Chưa xác định'}
            end={{ x: 0.7, y: 0 }}
            styles={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              fontSize: isSmallDevice() ? 20 : 25,
              fontFamily: 'Averta-ExtraBold',
            }}
          /> */}
          <TextTicker
            style={{ fontSize: 25 }}
            duration={12000}
            loop
            bounce
            repeatSpacer={150}
            scrollSpeed={100}
            bounceSpeed={400}
            marqueeDelay={800}>
            <Text
              style={{
                color: '#9166CC',
                fontSize: 25,
                fontFamily: 'Averta-ExtraBold',
              }}>
              {song?.getName() ?? 'Chưa xác định'}
            </Text>
          </TextTicker>
          <TextTicker
            style={{ fontSize: 16 }}
            duration={12000}
            loop
            bounce
            repeatSpacer={150}
            scrollSpeed={100}
            bounceSpeed={400}
            marqueeDelay={800}>
            <Text
              style={{
                fontSize: 16,
                marginTop: 6,
                fontWeight: '600',
                color: '#fff',
                fontFamily: 'lato-heavy',
              }}>
              {song?.getSubTitle(false) ?? 'Chưa rõ'}
            </Text>
          </TextTicker>
        </View>
      </View>
    );
  });

  render() {
    const { showAddPlaylist } = this.state;
    const { _hideModal } = this.props;
    return showAddPlaylist ? (
      <View>
        <AddPlayListModal
          addPlaylist={this.addPlaylist}
          songs={[this.props.song]}
        />
      </View>
    ) : (
      <View cls={`${isSmallDevice() ? 'heightFn-530' : ''} pa3`}>
        <FlatList
          ListHeaderComponent={this.renderHeader}
          data={this.menuItems}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          onScroll={event => {
            if (event.nativeEvent.contentOffset.y < scrollDownPosition) {
              if (typeof _hideModal == 'function') _hideModal();
            }
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const ActionItem = wrap(props => {
  return (
    <>
      <TouchableHighlight
        activeOpacity={1}
        underlayColor="#7c5994"
        onPress={props.onPress}
        cls="mb3 br5 ba">
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
      </TouchableHighlight>
    </>
  );
});
