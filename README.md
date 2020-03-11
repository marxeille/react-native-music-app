### Run

## Android
yarn
npm run player
npm run android

## Ios
yarn 
npm run player
cd ios -> pod install
npm run ios

### RootContext

-> Ban chat la noi luu cac RootStore( store[], playlists, albums, artists)

->

### PlayerStore

## 1, currentSong

-> types.reference(Song)

    -> rootStore.playerStore.playSong(data.nextTrack);

## 2,statusPlayer

-> La 1 PlayerState:

-> setState('String')

## 3, play, pause

-> Call rootStore.playerStore.play(), pause()

## next, previous

-> Ban chat la setSong va State
