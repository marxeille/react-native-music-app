import { UserStore } from "./user_store";
import { PlayerStore } from "./player_store"
import { HomeStore } from "./home_store"

import { types } from "mobx-state-tree"

export const RootStore = types.model("RootStore", {
  userStore: UserStore,
  playerStore: PlayerStore,
  homeStore: HomeStore
});