import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index } = this.props;
    if (index != undefined) {
      console.log("TCL: PlaylistItem -> render -> rootStore.userStore.playlists[index].title()", rootStore.userStore.playlists[index].title())
    }
    return (
      <View cls="flx-row aic pb3">
        <TouchableOpacity>
          <Image
            cls="widthFn-90 heightFn-82"
            source={
              index != undefined
                ? { uri: rootStore.userStore.playlists[index].getThumb() }
                : require('../../../../assets/images/add_playlist.png')
            }
          />
        </TouchableOpacity>

        <View>
          <TouchableOpacity>
            <Text cls="white fw7 f6 pl2">{index != undefined ? rootStore.userStore.playlists[index].title() : 'Tạo playlist'}</Text>
          </TouchableOpacity>
          {index != undefined ? (
            <Text cls="primaryPurple f6 pl2 pt1">của {rootStore.userStore.playlists[index].subTitle()}</Text>
          ) : null}
        </View>
      </View>

    );
  }
}
