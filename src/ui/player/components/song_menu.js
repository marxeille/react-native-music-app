import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import { rootStore } from '../../../data/context/root_context';

@observer
@wrap
export default class SongMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <View cls="aic jcc pt3 pb2">
          <ImageBackground
            cls="widthFn-283 heightFn-283 aic jcc"
            source={Images.ic_barcode}>
            <Image
              source={{ uri: rootStore.playerStore?.currentSong?.getThumb() }}
              cls="circleFn-185"
            />
          </ImageBackground>
          <View cls="aic jcc pt3">
            <LinearGradientText
              text={`${rootStore.playerStore?.currentSong?.getName()}`}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 23,
                fontWeight: '800',
              }}
            />
            <Text cls="white fw5 f7 pt1">
              {rootStore.playerStore?.currentSong?.getSubTitlte()}
            </Text>
          </View>
        </View>
        <View cls="pa3">
          <ActionItem icon={'ic_add_playlist'} title={'Thêm vào playlist'} />
          <ActionItem icon={'ic_add_song'} title={'Thêm vào danh sách chờ'} />
          <ActionItem icon={'ic_album'} title={'Xem album'} />
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
      <TouchableOpacity>
        <View cls="flx-row aic pt3 pb2">
          <Image source={Images[props.icon]} />
          <Text cls="primaryPurple pl3 fw7 f6">{props.title}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
});