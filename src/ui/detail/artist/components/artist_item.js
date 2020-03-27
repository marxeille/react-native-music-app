import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { subLongStr } from '../../../../utils';

const ArtistItem = observer(
  wrap(props => (
    <View cls="jcsb flx-row aic pr3" style={{ backgroundColor: '#321a54' }}>
      <TouchableOpacity>
        <View cls="flx-row pa3 pb2 pt2">
          <View cls="squareFn-50 aic jcc">
            <Text cls="white lightFont f5">
              {props.index < 10 ? '0' : ''}
              {props.index + 1}
            </Text>
          </View>

          <View cls="jcc pl3">
            <Text cls="white fw7 f6 lightFont">
              {subLongStr(`Vinahouse hey hey hey`, 15)}
            </Text>
            <Text cls="primaryPurple lightFont">123.456.789</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View cls="flx-row">
        <TouchableOpacity cls="pr3" onPress={() => {}}>
          <Image style={{ opacity: 0.2 }} source={Images.ic_like_uncheck} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.openModal}>
          <Image source={Images.ic_menu} />
        </TouchableOpacity>
      </View>
    </View>
  )),
);

export default ArtistItem;
