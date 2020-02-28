import { types, getEnv, flow } from 'mobx-state-tree';
import { Result } from './result'
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';

export const HomeStore = types.model("HomeStore", {
  state: Result,
  recently: types.array(types.reference(PlayList)),
  popular: types.array(types.reference(PlayList), []),
  suggesst: types.array(types.reference(PlayList)),
}).actions(self => {
  return {

  }
})