import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {Button} from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import {TextInput as PaperTextInput, Chip} from 'react-native-paper';

import {
  createList,
  updateList,
  shareList,
  getSharedWith,
  stopSharingList,
} from '../functions';

const Header = (props) => {
  const [menu, setMenu] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState(null);
  const [shareWith, setShareWith] = useState('');
  const [sharedWithUsers, setSharedWithUsers] = useState([]);

  const setMenuRef = (ref) => {
    setMenu(ref);
  };

  const hideMenu = () => {
    menu.hide();
  };

  const showMenu = () => {
    menu.show();
  };

  const onModalClose = () => {
    props.listUpdater();
  };

  const listSettings = () => {
    return (
      <Modal
        useNativeDriver={true}
        style={styles.modal}
        isVisible={modalVisible}
        coverScreen={true}
        backdropOpacity={0.8}
        onBackButtonPress={() => {
          onModalClose();
          setModalVisible(false);
        }}
        onBackdropPress={() => {
          onModalClose();
          setModalVisible(false);
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.listTitle}
              defaultValue={props.title}
              onChangeText={(text) => {
                if (text) {
                  setNewListName(text);
                }
              }}
              onEndEditing={() => {
                updateList(props.listId, newListName).then(() => {
                  props.listUpdater();
                });
              }}
            />
          </View>
          <Text style={styles.guide}>
            Share <Text style={styles.bold}>{props.title} </Text>with other
            people
          </Text>
          <PaperTextInput
            style={styles.input}
            label="Email Address"
            placeholder="Email Address"
            selectionColor={COLORS.mainLight}
            underlineColor={COLORS.mainLight}
            dense={true}
            onChangeText={(text) => {
              setShareWith(text);
            }}
            onBlur={() => {
              console.warn(shareWith);
              shareList(props.listId, shareWith, props.userId).then((res) => {
                setSharedWithUsers(res);
              });
            }}
          />
          <Text style={styles.guide}>Currenltly shared with</Text>
          {sharedWithUsers.map((item) => {
            return (
              <Chip
                icon="delete"
                onPress={() => {
                  stopSharingList(props.listId, item.id).then((res) => {
                    console.log('bolkapr:', res);
                    setSharedWithUsers(res);
                  });
                }}>
                {item.fullname}
              </Chip>
            );
          })}
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.header}>
      <DialogInput
        hintTextColor={COLORS.mainLight}
        isDialogVisible={showPrompt}
        title={'New List'}
        message={'Type the name of the new list'}
        hintInput={'List Name'}
        submitInput={(inputText) => {
          createList(props.userId, inputText).then(() => {
            props.listUpdater();
          });
          setShowPrompt(false);
        }}
        closeDialog={() => {
          setShowPrompt(false);
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
              console.warn('gogo');
              setShowPrompt(true);
              console.warn('show, ', showPrompt);
              hideMenu();
            }}>
            New List
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              props.selectedListUpdater({id: -1, title: 'Archive'});
              hideMenu();
            }}>
            Archive
          </MenuItem>
        </Menu>
      )}
      <View style={styles.listNameContainer}>
        <Text style={styles.text}> {props.title}</Text>
        {props.title !== 'Carina' && (
          <Button
            icon={
              <Icon
                name="settings"
                size={18}
                color="white"
                onPress={() => {
                  setModalVisible(true);
                  getSharedWith(props.listId).then((res) => {
                    setSharedWithUsers(res);
                    console.warn(res);
                  });
                }}
              />
            }
            buttonStyle={styles.settingButton}
          />
        )}
        {listSettings()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: COLORS.mainLight,
    flexDirection: 'row',
    alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center',
  },
  menu: {
    backgroundColor: COLORS.mainLight,
  },
  listNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingButton: {marginTop: 5, backgroundColor: COLORS.mainLight},
  text: {
    fontSize: 23,
    color: '#fff',
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  modalView: {
    backgroundColor: 'white',
    flex: 1,
  },
  modalHeader: {borderBottomColor: COLORS.mainLight, borderBottomWidth: 1},
  listTitle: {
    marginLeft: 5,
    marginRight: 25,
    fontSize: 30,
    textAlignVertical: 'center',
    color: COLORS.mainLight,
  },
  guide: {
    fontSize: 18,
    marginLeft: 5,
  },
  bold: {fontWeight: 'bold', color: COLORS.mainLight},
  input: {width: '90%', marginLeft: 5, marginBottom: 10},
});

export default Header;
