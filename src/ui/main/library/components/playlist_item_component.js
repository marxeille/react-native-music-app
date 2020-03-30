import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';

@observer
@wrap
export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index, item } = this.props;
    if (index != undefined) {
      console.log(
        'TCL: PlaylistItem -> render -> rootStore.libraryStore.playlists[index].title()',
        rootStore.libraryStore.playlists[index].title(),
      );
    }
    return (
      <>
        <TouchableOpacity
          onPress={() => navigate('album_detail', { id: item.id, item: item })}>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
              source={
                index != undefined
                  ? {
                      uri:
                        rootStore.libraryStore.playlists[index]?.getThumb() !==
                        ''
                          ? rootStore.libraryStore.playlists[index]?.getThumb()
                          : 'https://picsum.photos/200',
                    }
                  : require('../../../../assets/images/add_playlist.png')
              }
            />

            <View cls="pl2">
              <Text cls="white fw7 f6 pl2 lightFont">
                {index != undefined
                  ? rootStore.libraryStore.playlists[index].title()
                  : 'Tạo playlist'}
              </Text>
              {index != undefined ? (
                <Text cls="primaryPurple f7 pl2 pt1 lightFont">
                  của {rootStore.libraryStore.playlists[index].title()}
                </Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
