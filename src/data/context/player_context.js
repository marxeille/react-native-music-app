import React, { useState } from 'react';

export const PlayerContext = React.createContext({
  playerRef: { current: null },
  setPlayerRef: () => {},
  onForward: null,
  setOnForward: () => {},
});

const PlayerContextProvider = props => {
  const [playerRef, setPlayerRef] = useState({});
  const [onForward, setOnForward] = useState(null);
  return (
    <PlayerContext.Provider
      value={{
        playerRef: playerRef,
        setPlayerRef: setPlayerRef,
        onForward: onForward,
        setOnForward: setOnForward,
      }}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
