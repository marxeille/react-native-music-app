import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';

@observer
@wrap
export default class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, model } = this.props;
    return (
      <View cls="flx-row aic pt4 jcsb">
        <TouchableOpacity>
          <View cls="flx-row aic">
            <Image
              cls="widthFn-90 heightFn-82"
              source={{ uri: item?.getThumb() }}
            />
            <View>
              <Text cls="white fw7 f6 pl2">{item?.getName()}</Text>
              <Text cls="primaryPurple f7 pl2 pt1">{item?.artist}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => model.removeRecentlySong(item?.id)}>
          <Image cls="widthFn-20 heightFn-20" source={Images.ic_delete} />
        </TouchableOpacity>
      </View>
    );
  }
}
