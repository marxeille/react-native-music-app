import React, { Component } from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import { navigate } from '../../navigation/navigation_service'
import { wrap } from '../../themes';
import { rootStore } from '../../data/context/root_context';
import { observer } from 'mobx-react';
import { RootStore } from '../../data/repository/root_store';

@observer
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('DEBUG => home_component ', rootStore);
    rootStore.fetchData();
  }

  render() {
    console.log('DEBUG => home_component render', rootStore.homeStore.popular);
    return (
      <SafeAreaView>
        <View cls="bg-white fullView aic jcc">
          <Button
            title="Open Player"
            onPress={() => {
              navigate('player');
            }}
          />
          <Button
            title={`${rootStore.homeStore.popular.length > 0 ? rootStore.homeStore.popular[0].title() : 'no item'}`}
            onPress={() => {
              navigate('player');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
