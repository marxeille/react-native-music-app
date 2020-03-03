import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result'
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';

export const HomeStore = types.model("HomeStore", {
  state: Result,
  recently: types.array(types.reference(Album)),
  popular: types.array(types.reference(PlayList), []),
  suggesst: types.array(types.reference(PlayList)),
}).actions(self => {
  return {
  }
})
