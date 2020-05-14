import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import Images from '../../assets/icons/icons';
import TextTicker from 'react-native-text-ticker';

@observer
@wrap
export default class ItemHomeSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  playSong = () => {
    rootStore?.playlistSongStore?.clearListSongs();
    if (rootStore.playerStore?.currentSong?.id == this.props.id) {
      return this.props.navigate('player');
    }
    this.props.navigate('player', { trackId: this.props.id });
    rootStore?.playerStore?.setPlayFrom('Home');
  };

  render() {
    const { item } = this.props.item;

    return (
      <TouchableOpacity onPress={this.playSong}>
        <View cls="widthFn-130 pl3 mr3 pb2">
          <Image
            cls="heightFn-130 widthFn-130"
            source={
              item && item?.getThumb() !== ''
                ? { uri: item?.getThumb() }
                : Images.bAAlbum
            }
          />
          <View cls="pt2">
            <TextTicker
              style={{ fontSize: 13 }}
              duration={9000}
              loop
              bounce
              repeatSpacer={150}
              scrollSpeed={100}
              bounceSpeed={400}
              marqueeDelay={800}>
              <Text cls="white pt2 fw6 lightFont">
                {item?.getName() ?? 'Default'}
              </Text>
            </TextTicker>
            <Text cls="primaryPurple pt1 lightFont f10">
              {item?.getSubTitle() ?? 'Default'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
