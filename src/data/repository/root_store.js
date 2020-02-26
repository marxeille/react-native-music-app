import { UserStore } from "./user_store";

export class RootStore {

  userStore: UserStore = () => {
    return this.userStore;
  }
  constructor(userStore) {
    this.userStore = userStore;
  }


}