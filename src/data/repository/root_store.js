export class RootStore {
  userStore = () => {
    return this.userStore;
  }
  constructor(userStore) {
    this.userStore = userStore;
  }
}