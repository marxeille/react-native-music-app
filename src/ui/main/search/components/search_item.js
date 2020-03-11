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
    return (
      <View cls="flx-row aic pt4 jcsb">
        <TouchableOpacity>
          <View cls="flx-row aic">
            <Image
              cls="widthFn-90 heightFn-82"
              source={require('../../../../assets/images/cover1.png')}
            />
            <View>
              <Text cls="white fw7 f6 pl2">{'Tạo playlist'}</Text>
              <Text cls="primaryPurple f6 pl2 pt1">của</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={Images.ic_delete} />
        </TouchableOpacity>
      </View>
    );
  }
}
