import React, { Component } from 'react';
import Player from './Player';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';

export const TRACKS = [
  {
    id: '7',
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    artwork:
      'http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg',
    url:
      'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
  },
];

export const TRACKS2 = [
  {
    id: '4',
    title: 'Stressed Out 2',
    artist: 'Twenty One Pilots',
    artwork:
      'http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg',
    url:
      'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
  },
];

@observer
export default class App extends Component {
  constructor(props) {
    super(props);

    // rootStore.updateSongs([...TRACKS, ...TRACKS2]);
    // rootStore.queueStore.addNewQue(TRACKS);
  }
  render() {
    return <Player {...this.props} />;
  }
}
