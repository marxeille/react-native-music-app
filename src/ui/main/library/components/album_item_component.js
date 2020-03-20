import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { subLongStr } from '../../../../utils';

@observer
@wrap
export default class AlbumItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index } = this.props;

    if (
      index == undefined ||
      index > rootStore.userStore?.playlists?.length - 1
    ) {
      console.log(
        'TCL: PlaylistItem -> render -> rootStore.userStore.playlists[index].title()',
      );
      return null;
    } else {
      return (
        <View cls="pb3 pr3">
          <TouchableOpacity>
            <Image
              cls="widthFn-100 heightFn-82"
              source={
                index != undefined
                  ? { uri: rootStore.userStore.playlists[index].getThumb() }
                  : require('../../../../assets/images/add_playlist.png')
              }
            />
          </TouchableOpacity>

          <View>
            <TouchableOpacity>
              <Text cls="white fw7 f8 pt2">
                {index != undefined
                  ? rootStore.userStore.playlists[index].title()
                  : 'Tạo playlist'}
              </Text>
            </TouchableOpacity>
            {index != undefined ? (
              <Text cls="primaryPurple f8 pt1">
                của{' '}
                {subLongStr(rootStore.userStore.playlists[index].subTitle(), 6)}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }
  }
}
