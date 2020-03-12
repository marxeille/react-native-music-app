import React from 'react';
import { Text, View, Image } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';

const AlbumItem = observer(
  wrap(({ params }) => (
    <View cls="jcsb flx-row aic pr3" style={{ backgroundColor: '#321a54' }}>
      <View cls="flx-row pa3 pb2 pt2">
        <Image
          cls="squareFn-50"
          source={require('../../../../assets/images/cover1.png')}
        />
        <View cls="jcc pl3">
          <Text cls="white fw7 f6">123123</Text>
          <Text cls="primaryPurple">123123</Text>
        </View>
      </View>
      <Image source={Images.ic_menu} />
    </View>
  )),
);

export default AlbumItem;
