import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { wrap } from '../../themes';
import { observer } from 'mobx-react';
import { pop } from '../../navigation/navigation_service';

@observer
@wrap
export default class PlayerFullComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View cls="fullView aic jcc">
        <Text> player_full_component </Text>
        <Button
          title="Click here"
          onPress={() => {
            pop();
          }}
        />
      </View>
    );
  }
}
