import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Modifyplaylist from './modify_playlist';
import PlaylistMenuConcept from './menu';

const MenuConcept = ({
  item,
  title,
  songs,
  newTitleChange,
  textTitleChange,
  editTitle,
  changeOrder,
  settingItems,
  showMenuEdit,
  showEditTitle,
  changeShowMenuEdit,
  changeTitle,
}) => {
  const [menu, setMenu] = useState(!showMenuEdit);
  useEffect(() => {
    setMenu(!showMenuEdit);
  }, [showMenuEdit]);
  return menu ? (
    <PlaylistMenuConcept
      item={item}
      title={title}
      newTitleChange={newTitleChange}
      textTitleChange={textTitleChange}
      editTitle={editTitle}
      setMenu={setMenu}
      settingItems={settingItems}
      changeTitle={changeTitle}
      showEditTitle={showEditTitle}
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
