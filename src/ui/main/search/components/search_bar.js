import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';

@wrap
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.search = React.createRef();
  }

  render() {
    const {
      keyword,
      onChangeKeyword,
      onFocus,
      placeHolder,
      autoFocus,
    } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.search.current.focus();
        }}>
        <View cls="fullWidth pt3 pb3 flx-row aic">
          <View cls="pa3 flx-i" style={[styles.inputGroup]}>
            <Image source={Images.ic_search} />
            <TextInput
              ref={this.search}
              secureTextEntry={false}
              placeholderTextColor="#fff"
              placeholder={placeHolder ?? 'Nghệ sĩ, bài hát hoặc popcast'}
              style={[styles.inputText]}
              value={keyword}
              onFocus={() => onFocus()}
              onChangeText={value => onChangeKeyword(value)}
              autoCorrect={false}
              autoFocus={autoFocus ?? false}
            />
            {keyword == null || keyword == '' || keyword == undefined ? null : (
              <TouchableOpacity onPress={() => onChangeKeyword('')}>
                <Image source={Images.ic_delete_white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  icon: { width: 160, height: 100 },
  inputGroup: {
    borderWidth: 1,
    borderColor: '#4B3277',
    borderRadius: 12,
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
    fontFamily: 'lato-heavy',
    fontSize: 13,
  },
});
