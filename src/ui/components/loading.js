import React from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { wrap } from '../../themes';

// const Loading = () => <ActivityIndicator size="small" color="#fff" />;
const Loading = wrap(() => (
  <Image
    cls="widthFn-100 heightFn-100 aic jcc"
    resiseMode={'contain'}
    source={require('../../assets/images/loading.gif')}
  />
));

export default Loading;
