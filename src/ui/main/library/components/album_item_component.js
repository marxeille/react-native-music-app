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
    const { item } = this.props;

    return (
      <View cls="pb3 pr3">
        <TouchableOpacity>
          <Image
            cls="widthFn-100 heightFn-82"
            source={{ uri: item.getThumb() }}
          />
        </TouchableOpacity>

        <View>
          <TouchableOpacity>
            <Text cls="white fw7 f8 pt2">{subLongStr(item.title(), 12)}</Text>
          </TouchableOpacity>
          <Text cls="primaryPurple f8 pt1">
            của {subLongStr(item.subTitle(), 6)}
          </Text>
        </View>
      </View>
    );
  }
}
