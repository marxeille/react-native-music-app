import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { navigate } from '../../../../navigation/navigation_service';

@observer
@wrap
export default class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnPress = () => {
    const { item, model, _showModal } = this.props;
    if (item.getType() == 'song') {
      if (typeof _showModal == 'function') _showModal();
      return;
    } else if (item.getType() == 'artist') {
      return navigate('album_detail');
    } else {
      model.removeRecentlySong(item?.id);
    }
  };

  render() {
    const { item } = this.props;

    const icon =
      item.getType() == 'song'
        ? Images.ic_menu
        : item.getType() == 'artist'
        ? Images.ic_more
        : Images.ic_delete;

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
              <Text cls="primaryPurple f7 pl2 pt1">{item?.getSubTitle()}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleOnPress}>
          <Image cls="widthFn-20 heightFn-20" source={icon} />
        </TouchableOpacity>
      </View>
    );
  }
}
