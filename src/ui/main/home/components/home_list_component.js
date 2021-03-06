import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import ItemHome from '../../../components/item_home_component';
import { navigate } from '../../../../navigation/navigation_service';
import ItemHomeSmall from '../../../components/item_home_small';

@observer
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
    return <ItemHomeSmall id={item.item.id} item={item} navigate={navigate} />;
  });

  renderLargeItem = wrap(item => {
    if (item.item.tracks.length < 1) return null;
    return (
      <TouchableOpacity
        onPress={() =>
          navigate('album_detail', {
            id: item.item.id.toString(),
            item: item.item,
          })
        }>
        <ItemHome id={item.item.id} item={item} navigate={navigate} />
      </TouchableOpacity>
    );
  });

  render() {
    const { type, title, data } = this.props;

    return (
      <View cls="fullWidth">
        <View cls="flx-row pa3 pb3 pt0 pr0 aic">
          <MaskedView
            maskElement={
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 22,
                  fontFamily: 'Averta-ExtraBold',
                }}
                cls="fw5 f4">
                {title}
              </Text>
            }>
            <LinearGradient
              colors={['#4b3379', '#a57aae', '#b889c5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 22,
                  opacity: 0,
                  fontFamily: 'Averta-ExtraBold',
                }}
                cls="fw5 f4">
                {title}
              </Text>
            </LinearGradient>
          </MaskedView>
          <Image
            source={Images.sNg}
            cls="fullWidth heightFn-30"
            resizeMode="contain"
            style={{ flex: 1 }}
          />
        </View>
        <View cls="fullWidth">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
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
