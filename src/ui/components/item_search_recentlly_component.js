import React, { Component } from 'react';
import { View, Text } from 'react-native';

//Item tìm kiếm gần đây: Title, SubTitle, Thumb
export default class ItemSearchRecentllyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClear = (data) => {
    //Khi user remove 1 item tìm kiếm gần đây
  }

  render() {
    return (
      <View>
        <Text> item_search_recentlly_component </Text>
      </View>
    );
  }
}
