import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Modifyplaylist from './modify_playlist';
import PlaylistMenuConcept from './menu';

const MenuConcept = ({
  item,
  songs,
  changeOrder,
  settingItems,
  showMenuEdit,
  changeShowMenuEdit,
}) => {
  const [menu, setMenu] = useState(!showMenuEdit);
  useEffect(() => {
    setMenu(!showMenuEdit);
  }, [showMenuEdit]);
  return menu ? (
    <PlaylistMenuConcept
      item={item}
      setMenu={setMenu}
      settingItems={settingItems}
    />
  ) : (
    <Modifyplaylist
      item={item}
      setMenu={setMenu}
      songs={songs}
      changeOrder={changeOrder}
      changeShowMenuEdit={changeShowMenuEdit}
    />
  );
};

export default MenuConcept;
