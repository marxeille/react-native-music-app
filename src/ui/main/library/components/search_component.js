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
    this.state = {
      keyword: '',
    };
  }

  onChangeText(event, name) {
    let value = {};
    value[name] = event.nativeEvent.text;

    this.setState(value);
  }

  render() {
    return (
      <View cls="fullWidth pt3 pb3 flx-row aic">
        <LinearGradient
          colors={['#4E357A', '#9069A0', '#D39DC5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          cls="flx-i mr2"
          style={{ borderRadius: 10, height: 57, padding: 1 }}>
          <View cls="pa3 bg-#2C184A" style={[styles.inputGroup]}>
            <Image source={Images.ic_search} />
            <TextInput
              secureTextEntry={false}
              placeholderTextColor="#fff"
              placeholder={'Tìm trong nghệ sĩ'}
              style={[styles.inputText]}
              value={this.state.keyword}
              onChange={event => this.onChangeText(event, 'keyword')}
              autoCorrect={false}
            />
          </View>
        </LinearGradient>
        <TouchableOpacity>
          <LinearGradient
            colors={['#4E357A', '#9069A0', '#D39DC5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            cls="flx-i mr2"
            style={{ borderRadius: 10, height: 57, padding: 1 }}>
            <View
              cls="aic jcc bg-#2C184A"
              style={{ width: 55, height: 55, borderRadius: 10 }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={Images.ic_filter}
              />
            </View>
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
