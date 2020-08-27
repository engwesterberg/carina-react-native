import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {Button} from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import {TextInput as PaperTextInput, Chip} from 'react-native-paper';
import {ConfirmDialog} from 'react-native-simple-dialogs';

import {
  createList,
  updateList,
  shareList,
  getSharedWith,
  stopSharingList,
  deleteList,
} from '../functions';

const Header = (props) => {
  const [menu, setMenu] = useState(null);
  const [settingsMenu, setSettingsMenu] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState(null);
  const [shareWith, setShareWith] = useState('');
  const [sharedWithUsers, setSharedWithUsers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const setMenuRef = (ref) => {
    setMenu(ref);
  };

  const hideMenu = () => {
    menu.hide();
  };

  const showMenu = () => {
    menu.show();
  };

  const setSettingsMenuRef = (ref) => {
    setSettingsMenu(ref);
  };

  const hideSettingsMenu = () => {
    settingsMenu.hide();
  };

  const showSettingsMenu = () => {
    settingsMenu.show();
  };

  const onModalClose = () => {
    props.listUpdater();
  };

  const displayPrompt = () => {
    setShowPrompt(true);
    hideMenu();
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
            <View style={{flex: 1}}>
              <TextInput
                style={styles.listTitle}
                defaultValue={props.selectedList.title}
                onChangeText={(text) => {
                  if (text) {
                    setNewListName(text);
                  }
                }}
                onEndEditing={() => {
                  updateList(props.selectedList.id, newListName).then(() => {
                    props.listUpdater();
                  });
                }}
              />
            </View>
            <View>
              <Button
                icon={<Icon name="trash" size={30} color={COLORS.mainLight} />}
                buttonStyle={{
                  height: 35,
                  backgroundColor: 'white',
                  alignSelf: 'flex-start',
                }}
                onPress={() => {
                  setShowDeleteDialog(true);
                }}
              />
              <ConfirmDialog
                title="Confirm Dialog"
                message={'Are you sure you want to delete this list?'}
                visible={showDeleteDialog}
                onTouchOutside={() => {
                  setShowDeleteDialog(false);
                }}
                positiveButton={{
                  title: 'YES',
                  onPress: () => {
                    setShowDeleteDialog(false);
                    deleteList(props.selectedList.id).then(() => {
                      setModalVisible(false);
                      props.listUpdater();
                    });
                  },
                }}
                negativeButton={{
                  title: 'NO',
                  onPress: () => {
                    setShowDeleteDialog(false);
                  },
                }}
              />
            </View>
          </View>
          <Text style={styles.guide}>
            Share <Text style={styles.bold}>{props.selectedList.title} </Text>
            with other people
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
              shareList(props.selectedList.id, shareWith, props.userId).then(
                (res) => {
                  setSharedWithUsers(res);
                },
              );
            }}
          />
          <Text style={styles.guide}>{sharedWithUsers.length > 0 && 'Currently shared with'}</Text>
          {sharedWithUsers.map((item) => {
            return (
              <Chip
                icon="delete"
                key={item.id}
                onPress={() => {
                  stopSharingList(props.selectedList.id, item.id).then(
                    (res) => {
                      setSharedWithUsers(res);
                    },
                  );
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
          <MenuItem onPress={displayPrompt}>
            <Icon name="add" size={18} color={COLORS.mainLight} />
            <Text>New List </Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              hideMenu();
              props.selectedListUpdater({id: -1, title: 'Archive'});
            }}>
            <Icon name="trash" size={18} color={COLORS.mainLight} />
            <Text>Archive</Text>
          </MenuItem>
        </Menu>
      )}
      <View style={styles.listNameContainer}>
        <Text style={styles.text}> {props.selectedList.title}</Text>
        {props.selectedList.title !== 'Carina' &&
          props.selectedList.title !== 'Archive' &&
          props.selectedList.title !== 'Sign Up' &&
          props.selectedList.title !== 'Login' && (
            <Button
              icon={
                <Icon
                  name="settings"
                  size={18}
                  color="white"
                  onPress={() => {
                    setModalVisible(true);
                    getSharedWith(props.selectedList.id).then((res) => {
                      setSharedWithUsers(res);
                      console.warn(res);
                    });
                  }}
                />
              }
              buttonStyle={styles.listSettingsButton}
            />
          )}
        {listSettings()}
      </View>
      {props.selectedList.title !== 'Login' &&
        props.selectedList.title !== 'Sign Up' && (
          <Menu
            ref={setSettingsMenuRef}
            button={
              <Button
                icon={
                  <Icon
                    name="person-circle-sharp"
                    size={25}
                    color="white"
                    onPress={showSettingsMenu}
                  />
                }
                buttonStyle={styles.settingsButton}
              />
            }>
            <MenuItem
              onPress={() => {
                hideSettingsMenu();
                props.signOutHandler();
              }}>
              <Icon name="ios-log-out" size={20} color={COLORS.mainLight} />
              <Text>Sign Out</Text>
            </MenuItem>
          </Menu>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: COLORS.mainLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: COLORS.mainLight,
  },
  listNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listSettingsButton: {
    marginTop: 5,
    backgroundColor: COLORS.mainLight,
  },
  text: {
    fontSize: 23,
    color: '#fff',
  },
  settingsButton: {
    marginTop: 5,
    backgroundColor: COLORS.mainLight,
  },
  modalView: {
    backgroundColor: 'white',
    flex: 1,
  },
  modalHeader: {
    borderBottomColor: COLORS.mainLight,
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
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
