import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Images from '../../assets/icons/icons';

export default class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{
        height: 56,
        backgroundColor: '#110027'
      }}>
        <View style={{ height: 2, backgroundColor: 'white' }}>
        </View>
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
          <View style={{ height: 54, width: 54, backgroundColor: 'yellow' }}>
          </View>
          <View style={{ height: 54, flex: 1, paddingVertical: 8, paddingHorizontal: 16 }}>
            <Text style={{ color: 'white', fontSize: 16, fontStyle: 'normal', fontWeight: '600' }}>Mama Mia</Text>
            <Text style={{ color: '#835db8', fontSize: 16, fontStyle: 'normal', fontWeight: '400' }}>Lii Wayne</Text>
          </View>
          <View style={{
            padding: 12
          }}>
            <Image
              source={Images.ic_play}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
          <View style={{
            padding: 12
          }}>
            <Image
              source={Images.ic_favorited}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>

        </View>

      </View>
    );
  }
}
