import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { ShareDialog } from 'react-native-fbsdk';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import { rootStore } from '../../../data/context/root_context';
import AddPlayListModal from './add_playlist_modal';

@observer
@wrap
export default class SongMenu extends Component {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://facebook.com',
      contentDescription: 'Facebook sharing is easy!',
    };
    this.state = {
      showAddPlaylist: false,
      shareLinkContent: shareLinkContent,
    };
  }

  addPlaylist = state => {
    this.setState({ showAddPlaylist: state });
  };

  shareLinkWithShareDialog() {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            alert('Share cancelled');
          } else {
            alert('Share success with postId: ' + result.postId);
          }
        },
        function(error) {
          alert('Share fail with error: ' + error);
        },
      );
  }

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
              text={song?.title ?? 'Chưa xác định'}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 25,
                fontFamily: 'Averta-ExtraBold',
              }}
            />
            <Text cls="white fw5 f7 pt1 latoFont">
              {song?.artist ?? 'Chưa rõ'}
            </Text>
          </View>
        </View>
        <View cls="pa3">
          <ActionItem
            onPress={() => this.addPlaylist(true)}
            icon={'ic_add_playlist'}
            title={'Thêm vào playlist'}
          />
          <ActionItem icon={'ic_add_song'} title={'Thêm vào danh sách chờ'} />
          <ActionItem
            onPress={this.shareLinkWithShareDialog.bind(this)}
            icon={'ic_album'}
            title={'Xem album'}
          />
          <ActionItem icon={'ic_artist'} title={'Xem nghệ sĩ'} />
          <ActionItem icon={'ic_artist2'} title={'Nghệ sĩ tham gia'} />
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
