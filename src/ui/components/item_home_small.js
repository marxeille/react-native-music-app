import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../../navigation/navigation_service';

@observer
@wrap
export default class ItemHomeSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigate('player', { trackId: this.props.id })
        }>
        <View cls="widthFn-130 pl3 mr3">
          <Image
            cls="heightFn-130 widthFn-130"
            source={{ uri: rootStore.playlist.get(this.props.id).getThumb() }}
          />
          <Text cls="white pt2 fw6 lightFont">
            {rootStore.playlist.get(this.props.id).title()}
          </Text>
          <Text cls="primaryPurple pt1">
            {rootStore.playlist.get(this.props.id).subTitle()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
