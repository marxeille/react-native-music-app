import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import { navigate } from '../../navigation/navigation_service';

@observer
@wrap
export default class ItemHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View cls="widthFn-150 pl3 mr3">
        <Image
          cls="heightFn-150 widthFn-150"
          source={{ uri: rootStore.playlist.get(this.props.id).getThumb() }}
        />
        <Text cls="white pt2 fw6 lightFont">
          {rootStore.playlist.get(this.props.id).title()}
        </Text>
        <Text cls="primaryPurple pt1 lightFont f11">
          {rootStore.playlist.get(this.props.id).subTitle() ?? 'Billie Erlish'}
        </Text>
      </View>
    );
  }
}
