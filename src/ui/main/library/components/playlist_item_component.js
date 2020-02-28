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
        <View cls="flx-row aic pb3">
          <TouchableOpacity>
            <Image
              cls="widthFn-90 heightFn-82"
              source={
                img
                  ? require('../../../../assets/images/khabanh.png')
                  : require('../../../../assets/images/add_playlist.png')
              }
            />
          </TouchableOpacity>

          <View>
            <TouchableOpacity>
              <Text cls="white fw7 f6 pl2">{title ?? 'Tạo playlist'}</Text>
            </TouchableOpacity>
            {owner ? (
              <Text cls="primaryPurple f6 pl2 pt1">của {owner}</Text>
            ) : null}
          </View>
        </View>
      </>
    );
  }
}
