import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class ArtistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    return (
      <>
        <TouchableOpacity>
          <View cls="flx-row aic pb3">
            <Image
              cls="widthFn-90 heightFn-82"
              source={{ uri: item?.getThumb() }}
            />

            <View cls="pl2">
              <Text cls="white fw7 f6 pl2 lightFont">
                {item.getName() ?? ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
