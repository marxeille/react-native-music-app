import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import LinearGradient from 'react-native-linear-gradient';

@wrap
export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChangeText = text => {};

  render() {
    return (
      <View cls="fullWidth pt3 pb3 flx-row aic">
        <View cls="pa3 bg-#4B3277 flx-i" style={[styles.inputGroup]}>
          <Image source={Images.ic_search} />
          <TextInput
            secureTextEntry={false}
            placeholderTextColor="#fff"
            placeholder={'Tìm trong nghệ sĩ'}
            style={[styles.inputText]}
            value={''}
            onChange={event => this.onChangeText(event, 'loginName')}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={['#4A3278', '#8B659D', '#DDA5CB']}
            style={[
              styles.inputGroup,
              {
                marginLeft: 15,
              },
            ]}
            cls="pa3 jcc"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Image
              style={{ width: 24, height: 25 }}
              source={Images.ic_filter}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  icon: { width: 160, height: 100 },
  inputGroup: {
    borderWidth: 1,
    borderColor: '#4B3277',
    borderRadius: 10,
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    marginBottom: 5,
  },
  inputText: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    color: '#fff',
    paddingLeft: 15,
    fontSize: 15,
    fontFamily: 'lato-heavy',
  },
});
