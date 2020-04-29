import React, { Component } from 'react';
import Player from './Player';
import { observer } from 'mobx-react';

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Player {...this.props} />;
  }
}
