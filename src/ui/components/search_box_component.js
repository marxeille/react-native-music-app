import React, { Component } from 'react';
import { View, Text } from 'react-native';

//SearchBox cho mục tìm kiếm
//hint: Nghệ sĩ, bài hát hoặc podcast
export default class SearchBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSearch = (keyword) => {
    //Search keyword khi gõ hoặc enter
  }

  render() {
    return (
      <View>
        <Text> search_box_component </Text>
      </View>
    );
  }
}
