import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
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
    const { item } = this.props;
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            item ? navigate('album_detail', { id: item.id, item: item }) : null;
          }}>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
              source={
                item !== undefined
                  ? {
                      uri: item.getThumb(),
                    }
                  : require('../../../../assets/images/add_playlist.png')
              }
            />

            <View cls="pl2">
              <Text cls="white fw7 f6 pl2 lightFont">
                {item !== undefined ? item.title() : 'Tạo playlist'}
              </Text>
              {item !== undefined ? (
                <Text cls="primaryPurple f7 pl2 pt1 lightFont">
                  của {item.subTitle()}
                </Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
