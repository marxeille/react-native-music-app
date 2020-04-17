import React, { useCallback, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { wrap } from '../../../themes';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../../assets/icons/icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ModifyItem from './modify_item';
import { remove, cloneDeep } from 'lodash';

const Modifyplaylist = wrap(({ setMenu, item, songs }) => {
  console.log('songs', songs);

  const [songsState, setSongs] = useState(songs);
  const renderRightAction = useCallback(() => {
    return (
      <View cls="jcc pv1 ph3 aic">
        <TouchableOpacity
          onPress={() => {
            setMenu(true);
          }}>
          <Image source={Images.ic_v} />
        </TouchableOpacity>
      </View>
    );
  });
  const shuffeData = useCallback(data => {
    setSongs(data);
  });
  const removeSong = useCallback(song => {
    let cloneSongs = cloneDeep(songsState);
    remove(cloneSongs, function(s) {
      return s.id == song.id;
    });
    setSongs(cloneSongs);
    console.log(';cloneSongs', cloneSongs);
  });
  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    return (
      <ModifyItem
        item={item}
        drag={drag}
        isActive={isActive}
        key={index.toString()}
        removeSong={removeSong}
      />
    );
  });
  const renderHeader = useCallback(
    wrap(() => {
      return (
        <LinearGradient
          colors={['#291047', '#1a0632', '#110926', '#110926']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}>
          <View cls="pv2 flx-row aic">
            <View cls="aifs jcc flx-i">
              <TouchableOpacity
                onPress={() => {
                  setMenu(true);
                }}
                cls="jcc pv1 ph3 aic">
                <Image source={Images.ic_delete} />
              </TouchableOpacity>
            </View>
            <View cls="aic jcc flexFn-5 pt2">
              <LinearGradientText
                text={`Chỉnh sửa Playlist`}
                end={{ x: 0.7, y: 0 }}
                styles={{
                  justifyContent: 'center',
                  fontSize: 21,
                  fontWeight: '800',
                }}
              />
            </View>
            {renderRightAction()}
          </View>
        </LinearGradient>
      );
    }),
  );

  return (
    <View>
      {renderHeader()}
      <View cls="aic jcc pa3">
        <Text cls="white f3 avertaFont">{item.title()}</Text>
      </View>
      <View cls="fullView">
        <DraggableFlatList
          data={songsState}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data }) => {
            shuffeData(data);
          }}
        />
      </View>
    </View>
  );
});

export default Modifyplaylist;
