import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';

@observer
@wrap
export default class ItemHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity>
        <View cls="widthFn-150 pl3 mr2">
          <Image
            cls="heightFn-150 widthFn-150"
            source={require('../../../../assets/images/cover2.png')}
          />
          <Text cls="white pt2 fw6">GENE </Text>
          <Text cls="primaryPurple pt1">
            {this.subLongStr(`Today's top hit`)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
