import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { subLongStr } from '../../../../utils';

const AlbumItem = observer(
  wrap(props => (
    <View cls="jcsb flx-row aic pr3" style={{ backgroundColor: '#321a54' }}>
      {/* <TouchableOpacity> */}
      <View cls="flx-row pa3 pb2 pt2">
        <Image cls="squareFn-50" source={{ uri: props.item.getThumb() }} />

        <View cls="jcc pl3">
          <Text cls="white fw7 f6 lightFont">
            {subLongStr(props.item.getName(), 18)}
          </Text>
          <Text cls="primaryPurple lightFont">{props.item.getSubTitle()}</Text>
        </View>
      </View>
      {/* </TouchableOpacity> */}
      <TouchableOpacity onPress={() => props.openModal(props.item)}>
        <Image source={Images.ic_menu} />
      </TouchableOpacity>
    </View>
  )),
);

export default AlbumItem;
