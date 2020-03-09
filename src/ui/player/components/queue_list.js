import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { wrap } from '../../../themes';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import QueueChild from './queue_child';

const QueueList = wrap(props => {
  const dataList = [...props.data.values()];
  return (
    <View cls="pa3 bb" style={{ borderBottomColor: '#7351a1' }}>
      <View cls="pl1">
        <View cls="flx-row">
          <LinearGradientText
            text={props.title}
            end={{ x: 0.6, y: 0 }}
            styles={{
              justifyContent: 'center',
              fontSize: 19,
              fontWeight: '800',
            }}
          />
          <View style={{ paddingTop: 1 }}>
            <Text cls="primaryPurple fw7 f6">{props.subTitle}</Text>
          </View>
        </View>
        {dataList.map((item, index) => (
          <QueueChild item={item} key={index.toString()} />
        ))}
      </View>
    </View>
  );
});

export default QueueList;
