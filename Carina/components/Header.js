import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {Button} from 'react-native-elements';
import Prompt from 'react-native-input-prompt';
import {createList} from '../functions';

const Header = (props) => {
  const [menu, setMenu] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [newListName, setNewListName] = useState(null);

  const setMenuRef = (ref) => {
    setMenu(ref);
  };

  const hideMenu = () => {
    menu.hide();
  };

  const showMenu = () => {
    menu.show();
  };
  return (
    <View style={styles.header}>
      <Prompt
        visible={showPrompt}
        title="New List"
        placeholder="Type new list name"
        onCancel={() => {
          setShowPrompt(false);
        }}
        onChangeText={(text) => {
          setNewListName(text);
        }}
        onSubmit={(text) => {
          createList(props.userId, newListName).then(() => {
            props.listUpdater();
          });
          setShowPrompt(false);
          setNewListName(null);
        }}
      />
      {props.lists && (
        <Menu
          ref={setMenuRef}
          button={
            <Button
              icon={
                <Icon name="menu" size={30} color="white" onPress={showMenu} />
              }
              buttonStyle={styles.menu}
            />
          }>
          <MenuItem
            onPress={() => {
              props.selectedListUpdater({id: null, title: 'Carina'});
              hideMenu();
            }}>
            Carina (default)
          </MenuItem>
          <MenuDivider />
          {props.lists.map((item, index) => {
            return (
              <MenuItem
                key={item.id}
                onPress={() => {
                  props.selectedListUpdater(item);
              hideMenu();
                }}>
                {item.title}
              </MenuItem>
            );
          })}
          <MenuDivider />
          <MenuItem
            onPress={() => {
              setShowPrompt(true);
              hideMenu();
            }}>
            New List
          </MenuItem>
        </Menu>
      )}
      <Text style={styles.text}> {props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.lightPurple,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: COLORS.lightPurple,
  },
  text: {
    fontSize: 23,
    color: '#fff',
  },
});

export default Header;
