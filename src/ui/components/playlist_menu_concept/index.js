import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Modifyplaylist from './modify_playlist';
import PlaylistMenuConcept from './menu';

const MenuConcept = ({ item, songs, changeOrder }) => {
  const [menu, setMenu] = useState(true);
  return menu ? (
    <PlaylistMenuConcept item={item} setMenu={setMenu} />
  ) : (
    <Modifyplaylist
      item={item}
      setMenu={setMenu}
      songs={songs}
      changeOrder={changeOrder}
    />
  );
};

export default MenuConcept;
