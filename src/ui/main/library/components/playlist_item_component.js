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
      console.log(
        'TCL: PlaylistItem -> render -> rootStore.libraryStore.playlists[index].title()',
        rootStore.libraryStore.playlists[index].title(),
      );
    }
    return (
      <>
        <TouchableOpacity>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
              source={
                index != undefined
                  ? { uri: rootStore.libraryStore.playlists[index].getThumb() }
                  : require('../../../../assets/images/add_playlist.png')
              }
            />

            <View>
              <Text cls="white fw7 f6 pl2">
                {index != undefined
                  ? rootStore.libraryStore.playlists[index].title()
                  : 'Tạo playlist'}
              </Text>
              {index != undefined ? (
                <Text cls="primaryPurple f6 pl2 pt1">
                  của {rootStore.libraryStore.playlists[index].subTitle()}
                </Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
