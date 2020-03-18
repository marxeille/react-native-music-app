import React, { useState } from 'react';

export const PlayerContext = React.createContext({
  playerRef: { current: null },
  setPlayerRef: () => {},
});

const PlayerContextProvider = props => {
  const [playerRef, setPlayerRef] = useState({});
  return (
    <PlayerContext.Provider
      value={{
        playerRef: playerRef,
        setPlayerRef: setPlayerRef,
      }}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
