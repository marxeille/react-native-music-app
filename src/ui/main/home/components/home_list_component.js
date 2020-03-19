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
    return <ItemHomeSmall id={item.item.id} navigate={navigate} />;
  });

  renderLargeItem = wrap(item => {
    return (
      <TouchableOpacity onPress={() => navigate('album_detail', { id: '1' })}>
        <ItemHome id={item.item.id} navigate={navigate} />
      </TouchableOpacity>
    );
  });

  render() {
    const { type, title, cate, rightIcon } = this.props;
    console.log('rootStore.homeStore.popular', rootStore.homeStore.popular);

    return (
      <View cls={`fullWidth pb3 bb b--#4B3277 ${rightIcon ? 'pt4' : ''}`}>
        <View cls="flx-row pa3 pb3 aic jcsb">
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
            <TouchableOpacity onPress={() => navigate('setting')}>
              <Image cls="widthFn-20 heightFn-20" source={Images.ic_setting} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View cls="fullWidth">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={rootStore.homeStore.popular}
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
