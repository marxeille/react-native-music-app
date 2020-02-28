import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';

@wrap
export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, img, owner } = this.props;
    return (
      <>
        <TouchableOpacity>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
              source={
                img
                  ? require('../../../../assets/images/cover1.png')
                  : require('../../../../assets/images/add_playlist.png')
              }
            />
            <View>
              <Text cls="white fw7 f6 pl2">{title ?? 'Tạo playlist'}</Text>
              {owner ? (
                <Text cls="primaryPurple f6 pl2 pt1">của {owner}</Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
