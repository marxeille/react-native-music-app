import React from 'react';
import { Text, View } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../../../themes';

const LinearGradientText = wrap(
  ({ text, styles, borderBottom, start, end }) => (
    <View>
      <MaskedView maskElement={<Text style={styles}>{text}</Text>}>
        <LinearGradient
          colors={['#4e357a', '#765591', '#daa3c9']}
          start={start ?? { x: 0, y: 0 }}
          end={end ?? { x: 0.2, y: 0 }}>
          <Text style={[styles, { opacity: 0 }]} cls="fw5 f4">
            {text}
          </Text>
        </LinearGradient>
      </MaskedView>
      {borderBottom ? (
        <LinearGradient
          colors={['#4e357a', '#765591', '#daa3c9']}
          style={{ width: 67 }}
          start={start ?? { x: 0, y: 0 }}
          end={end ?? { x: 0.2, y: 0 }}>
          <View
            style={{
              height: 2,
            }}></View>
        </LinearGradient>
      ) : null}
    </View>
  ),
);

export default LinearGradientText;
