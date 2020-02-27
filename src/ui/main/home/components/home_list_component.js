import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';

@wrap
export default class HomeListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  subLongStr = str => {
    return str.length > 70 ? str.substring(0, 70) + '...' : str;
  };

  renderSmallItem = wrap(item => {
    return (
      <TouchableOpacity>
        <View cls="widthFn-111 pl3 mr2">
          <Image
            cls="heightFn-111 widthFn-111"
            source={require('../../../../assets/images/cover3.png')}
          />
          <Text cls="white pt2 fw6">Daily mix {item.item}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  renderLargeItem = wrap(item => {
    return (
      <TouchableOpacity>
        <View cls="widthFn-150 pl3 mr2">
          <Image
            cls="heightFn-150 widthFn-150"
            source={require('../../../../assets/images/cover2.png')}
          />
          <Text cls="white pt2 fw6">GENE {item.item}</Text>
          <Text cls="primaryPurple pt1">
            {this.subLongStr(`Today's top hit`)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  render() {
    const { type, title, data, rightIcon } = this.props;
    return (
      <View cls={`fullWidth pb3 bb b--#4B3277 ${rightIcon ? 'pt4' : ''}`}>
        <View cls="flx-row pa3 pb3 aic jcsb">
          {/* <Text cls="white fw5 f4">{title}</Text> */}
          <MaskedView
            maskElement={
              <Text style={{ fontWeight: '700', fontSize: 22 }}>{title}</Text>
            }>
            <LinearGradient
              colors={['#4b3379', '#a57aae', '#b889c5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text
                style={{ fontWeight: '700', fontSize: 22, opacity: 0 }}
                cls="fw5 f4">
                {title}
              </Text>
            </LinearGradient>
          </MaskedView>
          {rightIcon ? (
            <TouchableOpacity>
              <Image cls="widthFn-20 heightFn-20" source={Images.ic_setting} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View cls="fullWidth">
          <FlatList
            horizontal
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={
              type == 'large' ? this.renderLargeItem : this.renderSmallItem
            }
          />
        </View>
      </View>
    );
  }
}