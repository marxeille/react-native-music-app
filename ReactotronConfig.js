import { mst } from "reactotron-mst"
import Reactotron from "reactotron-react-native"
import AsyncStorage from "@react-native-community/async-storage"


export const reactotron = Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(mst())
  .connect() // let's connect!

// console.log = (...args) => {
//   Reactotron.display({
//     name: 'CONSOLE.LOG',
//     important: true,
//     value: args,
//     preview: args.length ? JSON.stringify(args) : args[0]
//   });
// }