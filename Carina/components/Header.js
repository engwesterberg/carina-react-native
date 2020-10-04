import {COLORS} from '../colors.js';
import {globalStyles} from '../globalstyles.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {Button} from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import {TextInput as PaperTextInput, Chip} from 'react-native-paper';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
  createList,
  updateList,
  shareList,
  getSharedWith,
  stopSharingList,
  deleteList,
} from '../functions';

const Header = (props) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState(null);
  const [shareWith, setShareWith] = useState('');
  const [sharedWithUsers, setSharedWithUsers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onModalClose = () => {
    props.listUpdater();
  };

  const displayPrompt = () => {
    setShowPrompt(true);
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
                    props.selectedListUpdater({
                      id: props.selectedList.id,
                      title: newListName,
                    });
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
          <TextInput
            label="Email Address"
            style={styles.bar}
            placeholder="Email Address"
            placeholderTextColor={COLORS.mainLight}
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
          <Text style={styles.guide}>
            {sharedWithUsers.length > 0 && 'Currently shared with'}
          </Text>
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
  const hamburgerMenu = () => {
    return (
      <Menu>
        <MenuTrigger>
          <Icon name="menu" size={30} color="white" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            onSelect={() => {
              props.selectedListUpdater({id: null, title: 'Carina'});
            }}>
            <View
              style={[
                globalStyles.menuRow,
                globalStyles.menuDivider,
                globalStyles.menuTopRow,
              ]}>
              <Icon name="menu" size={18} color="white" />
              <Text style={globalStyles.menuItemtext}>Carina (default)</Text>
            </View>
          </MenuOption>
          {props.lists.map((item, index) => {
            return (
              <MenuOption
                key={item.id}
                onSelect={() => {
                  props.selectedListUpdater(item);
                }}>
                <View
                  style={
                    index === props.lists.length - 1
                      ? [globalStyles.menuRow, globalStyles.menuDivider]
                      : globalStyles.menuRow
                  }>
                  <Icon name="add" size={18} color="white" />
                  <Text style={globalStyles.menuItemtext}>
                    {stringWithMaxLength(item.title, 22)}
                  </Text>
                </View>
              </MenuOption>
            );
          })}
          <MenuOption onSelect={displayPrompt}>
            <View style={globalStyles.menuRow}>
              <Icon name="add" size={18} color={COLORS.mainLight} />
              <Text style={globalStyles.menuItemtext}>New List </Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              props.selectedListUpdater({id: -1, title: 'Trash'});
            }}>
            <View style={globalStyles.menuRow}>
              <Icon name="trash" size={18} color={COLORS.mainLight} />
              <Text style={globalStyles.menuItemtext}>Trash</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };

  const settingsMenu = () => {
    return (
      <Menu>
        <MenuTrigger>
          <Icon name="person-circle-sharp" size={25} color="white" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            onSelect={() => {
              props.signOutHandler();
            }}>
            <View style={[globalStyles.menuRow, globalStyles.menuTopRow]}>
              <Icon name="ios-log-out" size={20} color={COLORS.mainLight} />
              <Text style={globalStyles.menuItemtext}>Sign Out</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };
  const stringWithMaxLength = (string, maxLength) => {
    if (maxLength >= string.length) {
      return string;
    } else {
      return string.substring(0, maxLength) + '..';
    }
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
      {hamburgerMenu()}
      <View style={styles.listNameContainer}>
        <Text
          style={styles.text}
          onPress={() => {
            if (props.selectedList.id > 0) {
              setModalVisible(true);
              getSharedWith(props.selectedList.id).then((res) => {
                setSharedWithUsers(res);
                console.warn(res);
              });
            }
          }}>
          {' '}
          {stringWithMaxLength(props.selectedList.title, 20)}
        </Text>
        {listSettings()}
      </View>
      {props.selectedList.title !== 'Login' &&
        props.selectedList.title !== 'Sign Up' && <View>{settingsMenu()}</View>}
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
  bar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    marginTop: 5,
    backgroundColor: COLORS.mainSuperLight,
    height: 40,
    width: '100%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    borderTopWidth: 0.2,
    borderTopColor: COLORS.mainLight,
    fontSize: 14,
    borderColor: COLORS.mainLight,
  },
});

export default Header;
