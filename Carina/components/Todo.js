import {COLORS} from '../colors.js';
import {globalStyles} from '../globalstyles.js';

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  updateTodo,
  deleteTodo,
  copyTodo,
  getSubTasks,
  addSubTask,
  editSubTask,
  deleteSubTask,
  updateTodoState,
  updateTodoTitle,
  updateTodoNote,
  updateTodoDate,
  updateTodoTime,
  updateTodoRecurring,
  updatePomoEstimate,
} from '../functions';

import Swipeable from 'react-native-swipeable-row';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';

const TOOLBAR_ICON_SIZE = 25;
const MODAL_LEFT_MARGIN = 5;

const Todo = (props) => {
  //gui
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  //Repeat Menu
  const [repeatMenu, setRepeatMenu] = useState(null);
  const [listMenu, setListMenu] = useState(null);
  //For updating todos
  const [newTitle, setNewTitle] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newPomoEstimate, setNewPomoEstimate] = useState(
    props.todo.pomo_estimate,
  );
  const [hasTime, setHasTime] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [newRepeat, setNewRepeat] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState('');

  const repeatValues = [
    {text: 'No Repetition', value: 0},
    {text: 'Every Day', value: 1},
    {text: 'Every 2nd day', value: 2},
    {text: 'Every 3rd day', value: 3},
    {text: 'Every 4th day', value: 4},
    {text: 'Every 5th day', value: 5},
    {text: 'Every 6th day', value: 6},
    {text: 'Every week', value: 7},
    {text: 'Every month', value: 30},
    {text: 'Every year', value: 365},
  ];

  const getRepeatValueString = (value, date) => {
    let string;
    if (value === 0) {
      return null;
    } else if (date && value === 7) {
      return '  ' + 'Every ' + moment(date).format('dddd');
    }
    repeatValues.forEach((element) => {
      if (element.value === value) {
        string = element.text;
      }
    });
    if (string) {
      return ' ' + string;
    }
  };

  const setRepeatMenuRef = (ref) => {
    setRepeatMenu(ref);
  };

  const hideRepeatMenu = () => {
    repeatMenu.hide();
  };

  const showRepeatMenu = () => {
    repeatMenu.show();
  };

  const setListMenuRef = (ref) => {
    setListMenu(ref);
  };

  const hideListMenu = () => {
    listMenu.hide();
  };

  const showListMenu = () => {
    listMenu.show();
  };

  const onModalClose = () => {
    if (newNote !== '') {
      updateTodoNote(props.todo.id, newNote).then((res) => {
        props.todoListUpdater();
      });
    } else {
      props.todoListUpdater();
    }
  };

  const syncTodoToDatabase = (date, addTime) => {
    let updated = props.todo;
    updated.title = newTitle || updated.title;
    updated.note = newNote || updated.note;
    updated.pomo_estimate = newPomoEstimate || updated.pomo_estimate;
    if (date) {
      updated.due_date = date;
    }
    updated.has_time = addTime || updated.has_time;

    updateTodo(updated);
    return updated;
  };

  const datePicker = () => {
    return (
      <View style={styles.button}>
        <Icon
          name="calendar"
          size={TOOLBAR_ICON_SIZE}
          color={COLORS.mainLight}
          onPress={() => {
            setShowDatePicker(true);
          }}
        />
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            let yy = moment(date).year();
            let mm = moment(date).month();
            let dd = moment(date).date();
            let deadline;
            if (props.todo.due_date === null) {
              deadline = moment([yy, mm, dd, hour || 18, minute || 0]);
            } else if (props.todo.due_date || newDate) {
              deadline = moment(props.todo.due_date || newDate).set({
                year: yy,
                month: mm,
                date: dd,
              });
              updateTodoDate(props.todo.id, moment(date).format('YYYY-MM-DD'));
            }
            setNewDate(deadline);
            syncTodoToDatabase(deadline);
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
        />
      </View>
    );
  };

  const timePicker = () => {
    return (
      <View style={styles.button}>
        <Icon
          name="clock-o"
          size={TOOLBAR_ICON_SIZE}
          color={COLORS.mainLight}
          backgroundColor="red"
          onPress={() => {
            setShowTimePicker(true);
          }}
        />
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          onConfirm={(date) => {
            setShowTimePicker(false);
            let deadline;
            if (props.todo.due_date || newDate) {
              let h = moment(date).hour();
              let m = moment(date).minute();
              deadline = moment(props.todo.due_date || newDate)
                .set('hour', h)
                .set('minute', m);
              setNewDate(deadline);
              setHasTime(true);
              updateTodoTime(
                props.todo.id,
                moment(deadline).format('YYYY-MM-DD HH:mm'),
              );
            }
          }}
          onCancel={() => {
            setShowTimePicker(false);
          }}
        />
      </View>
    );
  };

  const recurringMenu = () => {
    return (
      <PopupMenu>
        <MenuTrigger text="Select action" />
        <MenuOptions>
          <MenuOption onSelect={() => alert('Save')} text="Save" />
          <MenuOption onSelect={() => alert('Delete')}>
            <Text style={{color: 'red'}}>Delete</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => alert('Not called')}
            disabled={true}
            text="Disabled"
          />
        </MenuOptions>
      </PopupMenu>
    );
  };

  const expandedTodo = () => {
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
          <View>
            <View style={styles.modalHeader}>
              <TextInput
                style={styles.todoTitle}
                defaultValue={newTitle || props.todo.title}
                onChangeText={(text) => {
                  if (text) {
                    setNewTitle(text);
                  }
                }}
                onEndEditing={() => {
                  updateTodoTitle(props.todo.id, newTitle);
                }}
              />
            </View>
            <View style={styles.dateRowView}>
              {(props.todo.due_date || newDate) && dateOnly()}
            </View>
            <View style={styles.expandedTools}>
              <View style={styles.pomoContainer}>
                <Icon
                  name="play"
                  size={TOOLBAR_ICON_SIZE}
                  style={styles.button}
                  color={COLORS.mainLight}
                  onPress={() => {
                    props.updatePomoActive(props.todo);
                    setModalVisible(false);
                  }}
                />
                <TextInput
                  style={styles.pomosDoneText}
                  value={String(props.todo.pomo_done)}
                  editable={false}
                />
                <TextInput
                  style={styles.pomoSeparator}
                  value={'/'}
                  editable={false}
                />
                <TextInput
                  style={styles.pomoEstimateText}
                  value={String(newPomoEstimate)}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    setNewPomoEstimate(Number(text));
                  }}
                  onEndEditing={() => {
                    updatePomoEstimate(props.todo.id, newPomoEstimate);
                  }}
                />
              </View>
              <View style={styles.todoTools}>
                {datePicker()}
                {(props.todo.due_date || newDate) && timePicker()}
                {(props.todo.due_date || newDate) && (
                  <View>
                    <Menu
                      ref={setRepeatMenuRef}
                      button={
                        <Button
                          icon={
                            <Icon
                              name="repeat"
                              size={TOOLBAR_ICON_SIZE}
                              color={COLORS.mainLight}
                              onPress={showRepeatMenu}
                            />
                          }
                          buttonStyle={styles.settingsButton}
                        />
                      }>
                      {repeatValues.map((item) => {
                        return (
                          <MenuItem
                            onPress={() => {
                              hideRepeatMenu();
                              console.warn(item.value);
                              updateTodoRecurring(
                                props.todo.id,
                                item.value,
                              ).then((res) => {
                                console.log(res);
                                setNewRepeat(item.value);
                              });
                            }}>
                            <Text>{item.text}</Text>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </View>
                )}
                <View>
                  <Menu
                    ref={setListMenuRef}
                    button={
                      <Button
                        icon={
                          <MaterialCommunityIconsI
                            name="folder-move-outline"
                            size={TOOLBAR_ICON_SIZE}
                            color={COLORS.mainLight}
                            onPress={showListMenu}
                          />
                        }
                        buttonStyle={styles.settingsButton}
                      />
                    }>
                    <MenuItem
                      onPress={() => {
                        hideListMenu();
                        let updated = props.todo;
                        updated.list_id = null;
                        updateTodo(updated).then((res) => {});
                      }}>
                      <Text
                        style={{
                          fontWeight: !props.todo.list_id ? 'bold' : 'normal',
                        }}>
                        Carina (default)
                      </Text>
                    </MenuItem>
                    <MenuDivider />
                    {props.lists.map((item) => {
                      return (
                        <MenuItem
                          onPress={() => {
                            console.warn(item);
                            hideListMenu();
                            let updated = props.todo;
                            updated.list_id = item.id;
                            updateTodo(updated).then((res) => {});
                          }}>
                          <Text
                            style={{
                              fontWeight:
                                item.id === props.todo.list_id
                                  ? 'bold'
                                  : 'normal',
                            }}>
                            {item.title}
                          </Text>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </View>
              </View>
            </View>
          </View>
          <TextInput
            value={newSubTask}
            style={styles.bar}
            placeholder="+ Add Subtask"
            placeholderTextColor={COLORS.mainLight}
            onChangeText={(text) => {
              setNewSubTask(text);
            }}
            onBlur={() => {
              if (newSubTask !== '') {
                addSubTask(props.todo.id, newSubTask).then(() => {
                  getSubTasks(props.todo.id, props.token).then((res) => {
                    setSubTasks(res);
                  });
                });
                console.warn(props.todo.id, newSubTask);
                setNewSubTask('');
              }
            }}
          />
          {subTasks.length > 0 && (
            <View
              style={{
                maxHeight: 150,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.mainLight,
              }}>
              <ScrollView>
                {subTasks.map((item) => {
                  return (
                    <View style={styles.subTaskContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          editSubTask(
                            item.id,
                            item.title,
                            item.state === 0 ? 1 : 0,
                          ).then(() => {
                            getSubTasks(props.todo.id, props.token).then(
                              (res) => {
                                setSubTasks(res);
                              },
                            );
                          });
                        }}>
                        <MaterialCommunityIconsI
                          size={25}
                          name={
                            item.state === 0
                              ? 'checkbox-blank-circle-outline'
                              : 'checkbox-marked-circle-outline'
                          }
                          color={COLORS.mainLight}
                        />
                      </TouchableOpacity>
                      <Text
                        onPress={() => {
                          editSubTask(
                            item.id,
                            item.title,
                            item.state === 0 ? 1 : 0,
                          ).then(() => {
                            getSubTasks(props.todo.id, props.token).then(
                              (res) => {
                                setSubTasks(res);
                              },
                            );
                          });
                        }}
                        style={{
                          textDecorationLine:
                            item.state === 0 ? null : 'line-through',
                        }}>
                        {item.title}{' '}
                      </Text>
                      <Icon
                        style={{marginLeft: 'auto', marginRight: 10}}
                        name="trash"
                        size={25}
                        color={COLORS.mainLight}
                        onPress={() => {
                          deleteSubTask(item.id).then(() => {
                            getSubTasks(props.todo.id, props.token).then(
                              (res) => {
                                setSubTasks(res);
                              },
                            );
                          });
                        }}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <View style={{flex: 2}}>
            <TextInput
              style={styles.note}
              placeholder="Write a note"
              defaultValue={props.todo.note}
              placeholderTextColor="gray"
              multiline={true}
              onChangeText={(text) => {
                setNewNote(text);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };
  const dateOnly = () => {
    let date = moment(newDate || props.todo.due_date).format('MMM Do');
    let time;
    if (props.todo.has_time || hasTime) {
      time = moment(newDate || props.todo.due_date).format('HH:mm');
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: MODAL_LEFT_MARGIN,
        }}>
        <Text
          style={{
            color: COLORS.mainDark,
            borderRadius: 3,
            fontSize: 18,
            paddingRight: 1,
            paddingLeft: 1,
            fontFamily: 'Roboto',
          }}>
          {date}
        </Text>
        {time && (
          <Text
            style={{
              color: COLORS.mainDark,
              borderRadius: 3,
              fontSize: 18,
              paddingRight: 1,
              paddingLeft: 1,
              fontFamily: 'Roboto-Bold',
            }}>
            {time}
          </Text>
        )}
        {props.todo.recurring !== 0 && (
          <Text
            style={{
              color: COLORS.mainDark,
              borderRadius: 3,
              fontSize: 18,
              paddingRight: 1,
              paddingLeft: 1,
              fontFamily: 'Roboto',
            }}>
            {getRepeatValueString(newRepeat || props.todo.recurring)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View>
      {expandedTodo()}
      <Swipeable
        rightContent={
          <View style={styles.swipeRight}>
            <Image
              style={styles.noteImg}
              source={require('../assets/trash-white.png')}
            />
          </View>
        }
        leftContent={
          <View style={styles.swipeLeft}>
            <Image
              style={styles.noteImg}
              source={require('../assets/trash-white.png')}
            />
          </View>
        }
        onRightActionRelease={() => {
          deleteTodo(props.todo.id).then(() => {
            props.todoListUpdater();
          });
          props.removeFromList(props.todo.id);
        }}
        onLeftActionRelease={() => {
          deleteTodo(props.todo.id).then(props.todoListUpdater());
          props.removeFromList(props.todo.id);
        }}>
        <View style={styles.todoContainer} key={props.id}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              setModalVisible(true);
              getSubTasks(props.todo.id, props.token).then((res) => {
                setSubTasks(res);
              });
            }}>
            <View style={styles.todoInfoContainer}>
              <View style={styles.row1}>
                <TouchableOpacity
                  onPress={() => {
                    let updatedTodo = props.todo;
                    let newState = updatedTodo.state === 0 ? 1 : 0;
                    updateTodoState(props.todo.id, newState, props.token).then(
                      () => {
                        console.warn('update');
                        props.todoListUpdater();
                      },
                    );
                    //updateTodo(updatedTodo).then(props.todoListUpdater());
                    if (props.todo.recurring) {
                      let copy = props.todo;
                      if (copy.recurring === 30) {
                        copy.due_date = moment(copy.due_date).add(1, 'months');
                      } else if (copy.recurring === 365) {
                        copy.due_date = moment(copy.due_date).add(1, 'years');
                      } else {
                        copy.due_date = moment(copy.due_date).add(
                          props.todo.recurring,
                          'days',
                        );
                      }
                      copyTodo(props.todo, props.token).then(() => {
                        props.todoListUpdater();
                      });
                    }
                  }}>
                  {props.todo.state !== 2 ? (
                    <MaterialCommunityIconsI
                      size={25}
                      name={
                        props.todo.state === 0
                          ? 'checkbox-blank-circle-outline'
                          : 'checkbox-marked-circle-outline'
                      }
                      color={COLORS.gray}
                    />
                  ) : (
                    <Icon
                      name="refresh"
                      size={30}
                      color={COLORS.mainLight}
                      onPress={() => {
                        let updatedTodo = props.todo;
                        updatedTodo.state = 0;
                        updateTodo(updatedTodo).then(props.todoListUpdater());
                      }}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecorationLine:
                        props.todo.state === 1 ? 'line-through' : 'none',
                      marginLeft: 5,
                    },
                  ]}>
                  {props.todo.title}
                </Text>
              </View>
              <View style={styles.row2}>
                {props.todo.due_date && timeLabel(props.todo)}
                <Text style={globalStyles.coloredTextMedium}>
                  {getRepeatValueString(
                    props.todo.recurring,
                    props.todo.due_date,
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.noteContainer}>
            {props.todo.note && (
              <MaterialCommunityIconsI
                name="tooltip-text"
                size={25}
                color={COLORS.gray}
              />
            )}
          </View>
        </View>
      </Swipeable>
    </View>
  );
};
const timeLabel = (todo) => {
  let time, daysAgoString;
  if (todo.has_time) {
    time = moment(todo.due_date).format('HH:mm');
  }

  if (todo.state === 1) {
    let daysAgo = moment()
      .startOf('day')
      .diff(moment(todo.completed).startOf('day'), 'days');
    switch (daysAgo) {
      case 0:
        daysAgoString = 'Done Today';
        break;
      case 1:
        daysAgoString = 'Done Yesterday';
        break;
      default:
        daysAgoString = `Done ${daysAgo} days ago`;
        break;
    }
  }
  return todo.state === 0 ? (
    <View style={styles.todoLabelContainer}>
      <Text
        style={{
          color: COLORS.gray,
          fontSize: 14,
          fontFamily: 'Roboto',
        }}>
        {time}
      </Text>
      {todo.pomo_estimate !== 0 ? (
        <View style={{}}>
          <Text
            style={{
              color: COLORS.gray,
              fontFamily: 'Roboto-Bold',
              fontSize: 14,
              marginLeft: 2,
            }}>
            {' '}
            {/*{`${todo.pomo_done}/${todo.pomo_estimate}🍅`}*/}
          </Text>
        </View>
      ) : null}
    </View>
  ) : (
    <Text style={styles.daysAgo}>{daysAgoString}</Text>
  );
};
const dateLabel = (todo) => {
  const one_day = 1000 * 60 * 60 * 24;
  let color;
  let days;
  let diff = moment(todo.due_date) - moment();
  if (diff === 0) {
    color = COLORS.orange;
    days = 'Today';
  } else if (diff === 1) {
    color = COLORS.yellow;
    days = 'Tomorrow';
  } else if (diff === -1) {
    color = COLORS.red;
    days = 'Yesterday';
  } else if (diff >= 2) {
    color = COLORS.green;
    days = `Due in ${Math.floor(
      (moment(todo.due_date) - moment()) / one_day,
    )} days`;
  } else if (moment(todo.due_date) < moment().set('hour', 0)) {
    color = COLORS.red;
    days = `${Math.floor(
      (moment() - moment(todo.due_date)) / one_day,
    )} days overdue`;
  }
  if (todo.has_time) {
    days =
      days +
      ' at ' +
      moment(todo.due_date).hour() +
      ':' +
      moment(todo.due_date).minute();
    if (moment(todo.due_date).minute() === 0) {
      days = days + '0';
    }
  }

  return (
    <View style={styles.todoLabelContainer}>
      <Text
        style={{
          color: color,
          fontSize: 12,
          fontFamily: 'Roboto',
        }}>
        {days}
      </Text>
      {todo.pomo_estimate !== 0 ? (
        <View style={{}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Roboto-Bold',
              fontSize: 12,
            }}>
            {' '}
            {`${todo.pomo_done}/${todo.pomo_estimate}🍅`}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    height: 45,
  },
  todoInfoContainer: {
    justifyContent: 'center',
    flexGrow: 1,
    marginLeft: 5,
  },
  row1: {
    flex: 4,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row2: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  recurringText: {color: COLORS.mainLight},
  noteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  noteImg: {
    width: 30,
    height: 30,
  },
  text: {
    fontSize: 18,
    color: COLORS.gray,
    fontFamily: 'Roboto',
  },
  swipeRight: {
    backgroundColor: COLORS.red,
    flex: 1,
    justifyContent: 'center',
  },
  swipeLeft: {
    backgroundColor: COLORS.red,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  swipeText: {
    color: 'white',
    fontSize: 24,
  },
  modal: {
    backgroundColor: 'white',
  },
  modalView: {
    backgroundColor: 'white',
    flex: 1,
  },
  modalHeader: {flexDirection: 'row'},

  dateRowView: {justifyContent: 'center'},
  expandedTools: {
    height: 40,
    alignSelf: 'center',
    width: '98%',
    paddingLeft: MODAL_LEFT_MARGIN,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 0.8,
    borderTopColor: COLORS.mainLight,
    backgroundColor: 'white',
  },
  todoTitle: {
    marginLeft: MODAL_LEFT_MARGIN,
    flex: 1,
    marginRight: 25,
    padding: 0,
    fontSize: 40,
    textAlignVertical: 'center',
    color: COLORS.mainLight,
    fontFamily: 'Roboto',
  },
  repeatPicker: {
    flex: 1,
    color: 'black',
    marginLeft: MODAL_LEFT_MARGIN,
  },
  button: {
    marginLeft: 5,
    marginRight: 10,
    alignSelf: 'center',
  },
  pomoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomosDoneText: {
    color: 'black',
    maxWidth: 20,
    fontSize: 20,
    textAlign: 'center',
    padding: 0,
  },
  pomoEstimateText: {
    color: COLORS.mainLight,
    marginLeft: 1,
    marginRight: 10,
    maxWidth: 20,
    fontSize: 20,
    textAlign: 'center',
    padding: 0,
  },
  pomoSeparator: {
    color: COLORS.mainLight,
    marginLeft: 1,
    fontSize: 20,
    maxWidth: 10,
    textAlign: 'center',
    padding: 0,
  },

  settingsButton: {
    backgroundColor: 'transparent',
    height: 100,
  },
  subTaskContainer: {flexDirection: 'row', alignItems: 'center', padding: 5},
  note: {
    backgroundColor: 'white',
    height: '80%',
    fontSize: 24,
    fontFamily: 'Roboto-Light',
    textAlignVertical: 'top',
  },
  todoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
  },
  todoTools: {
    flexDirection: 'row',
  },
  bar: {
    color: COLORS.mainDark,
    marginTop: 5,
    alignSelf: 'center',
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
  daysAgo: {
    marginLeft: 30,
    color: COLORS.gray,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
});

export default Todo;
