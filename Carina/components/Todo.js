/* eslint react-native/no-inline-styles: 0 */
import moment from 'moment';
import {COLORS} from '../colors.js';
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
import {RadioButton} from 'react-native-paper';
import {
  updateTodo,
  deleteTodo,
  copyTodo,
  getSubTasks,
  addSubTask,
  editSubTask,
  deleteSubTask,
} from '../functions';
import Swipeable from 'react-native-swipeable-row';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';

import {TextInput as PaperTextInput} from 'react-native-paper';
import {Picker} from 'react-native';

const TOOLBAR_ICON_SIZE = 20;

const Todo = (props) => {
  //gui
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  //For updating todos
  const [newTitle, setNewTitle] = useState(null);
  const [newNote, setNewNote] = useState(null);
  const [newPomoEstimate, setNewPomoEstimate] = useState(
    props.todo.pomo_estimate,
  );
  const [newDate, setNewDate] = useState(null);
  const [hasTime, setHasTime] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState('');
  const [pickerValue, setPickerValue] = useState(0);

  const datePickerHandler = () => {
    setShowDatePicker(true);
  };

  const timePickerHandler = () => {
    setShowTimePicker(true);
  };

  const onModalClose = () => {
    props.todoListUpdater();
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
                  syncTodoToDatabase(newDate || props.todo.due_date);
                }}
              />
            </View>
            <View style={styles.expandedTools}>
              <View style={styles.pomoContainer}>
                <Icon
                  name="play"
                  size={15}
                  color={COLORS.mainDark}
                  onPress={() => {
                    props.updatePomoActive(props.todo);
                    setModalVisible(false);
                  }}
                />
                <TextInput
                  style={styles.pomoTools}
                  value={String(props.todo.pomo_done)}
                  editable={false}
                />
                <TextInput style={styles.pomoSeparator} value={'/'} />
                <TextInput
                  style={styles.pomoTools}
                  value={String(newPomoEstimate)}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    setNewPomoEstimate(Number(text));
                  }}
                  onEndEditing={() => {
                    syncTodoToDatabase(newDate || props.todo.due_date);
                  }}
                />
              </View>
              <View style={styles.datetimeView}>
                {!props.todo.due_date && (
                  <Icon
                    name="calendar"
                    size={TOOLBAR_ICON_SIZE}
                    color={COLORS.mainDark}
                    style={styles.button}
                    onPress={() => {
                      setShowDatePicker(true);
                    }}
                  />
                )}
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
                    }
                    setNewDate(deadline);
                    syncTodoToDatabase(deadline);
                  }}
                  onCancel={() => {
                    setShowDatePicker(false);
                  }}
                />
                {props.todo.due_date &&
                  dateOnly(props.todo, datePickerHandler, timePickerHandler)}
                {!props.todo.has_time && (
                  <Icon
                    name="clock-o"
                    size={TOOLBAR_ICON_SIZE}
                    color={COLORS.mainDark}
                    style={styles.button}
                    onPress={() => {
                      setShowTimePicker(true);
                    }}
                  />
                )}
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
                      syncTodoToDatabase(deadline, true);
                      setHasTime(true);
                    }
                  }}
                  onCancel={() => {
                    setShowTimePicker(false);
                  }}
                />
              </View>
              {(props.todo.due_date || newDate) && (
                <Picker
                  selectedValue={
                    props.todo.recurring ? props.todo.recurring : pickerValue
                  }
                  style={styles.repeatPicker}
                  onValueChange={(itemValue, itemIndex) => {
                    setPickerValue(itemValue);
                    let updated = props.todo;
                    updated.recurring = itemValue;
                    updateTodo(updated).then((res) => {});
                  }}>
                  <Picker.Item label="No Repetition" value={0} />
                  <Picker.Item label="Every Day" value={1} />
                  <Picker.Item label="Every second day" value={2} />
                  <Picker.Item label="Every 3rd day" value={3} />
                  <Picker.Item label="Every 4th day" value={4} />
                  <Picker.Item label="Every 5th day" value={5} />
                  <Picker.Item label="Every 6th day" value={6} />
                  <Picker.Item label="Every week" value={7} />
                  <Picker.Item label="Every month" value={30} />
                  <Picker.Item label="Every year" value={365} />
                </Picker>
              )}
            </View>
          </View>
          <PaperTextInput
            dense={true}
            value={newSubTask}
            style={styles.input}
            placeholder="Add Subtask"
            placeholderTextColor={COLORS.mainLight}
            onChangeText={(text) => {
              setNewSubTask(text);
            }}
            onBlur={() => {
              if (newSubTask !== '') {
                addSubTask(props.todo.id, newSubTask).then(() => {
                  getSubTasks(props.todo.id).then((res) => {
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
                      <RadioButton
                        status={item.state === 0 ? 'unchecked' : 'checked'}
                        color={COLORS.mainLight}
                        onPress={() => {
                          editSubTask(
                            item.id,
                            item.title,
                            item.state === 0 ? 1 : 0,
                          ).then(() => {
                            getSubTasks(props.todo.id).then((res) => {
                              setSubTasks(res);
                            });
                          });
                        }}
                      />
                      <Text
                        style={{
                          textDecorationLine:
                            item.state === 0 ? null : 'line-through',
                        }}>
                        {item.title}{' '}
                      </Text>
                      <Icon
                        style={{marginLeft: 'auto', marginRight: 10}}
                        name="trash"
                        size={20}
                        color={COLORS.mainLight}
                        onPress={() => {
                          deleteSubTask(item.id).then(() => {
                            getSubTasks(props.todo.id).then((res) => {
                              setSubTasks(res);
                            });
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
              onEndEditing={() => {
                syncTodoToDatabase(newDate || props.todo.due_date);
              }}
            />
          </View>
        </View>
      </Modal>
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
          <View style={styles.radioButtonContainer}>
            {props.todo.state !== 2 ? (
              <RadioButton
                status={props.todo.state === 0 ? 'unchecked' : 'checked'}
                color={COLORS.mainDark}
                onPress={() => {
                  let updatedTodo = props.todo;
                  updatedTodo.state = updatedTodo.state === 0 ? 1 : 0;
                  updateTodo(updatedTodo).then(props.todoListUpdater());
                  if (props.todo.recurring) {
                    let copy = props.todo;
                    copy.due_date = moment(copy.due_date).add(
                      props.todo.recurring,
                      'days',
                    );
                    copyTodo(props.todo).then(() => {
                      updateTodo(updatedTodo).then(props.todoListUpdater());
                    });
                  }
                }}
              />
            ) : (
              <Icon
                name="recycle"
                size={30}
                color={COLORS.mainLight}
                onPress={() => {
                  let updatedTodo = props.todo;
                  updatedTodo.state = 0;
                  updateTodo(updatedTodo).then(props.todoListUpdater());
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={() => {
              setModalVisible(true);
              getSubTasks(props.todo.id).then((res) => {
                setSubTasks(res);
              });
            }}>
            <View style={styles.todoInfoContainer}>
              <View style={styles.row1}>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecorationLine:
                        props.todo.state === 1 ? 'line-through' : 'none',
                    },
                  ]}>
                  {props.todo.title}
                </Text>
              </View>
              <View style={styles.row2}>
                {props.todo.due_date &&
                  props.todo.state != 1 &&
                  dateLabel(props.todo)}
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.noteContainer}>
            {props.todo.note && (
              <MaterialCommunityIconsI
                name="tooltip-text"
                size={25}
                color={COLORS.mainDark}
              />
            )}
          </View>
        </View>
      </Swipeable>
    </View>
  );
};

const dateLabel = (todo) => {
  const one_day = 1000 * 60 * 60 * 24;
  let color;
  let days;
  let diff = moment(todo.due_date).date() - moment().date();
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
          alignSelf: 'flex-start',
          fontSize: 12,
          fontFamily: 'Helvetica-Bold',
        }}>
        {days}
      </Text>
      {todo.pomo_estimate !== 0 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
          }}>
          <Text style={{color: COLORS.mainDark}}>
            {' '}
            {`${todo.pomo_done}/${todo.pomo_estimate}🍅`}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
const dateOnly = (todo, datePickerHandler, timePickerHandler) => {
  let date = moment(todo.due_date).format('MMM Do');
  let time;
  if (todo.has_time) {
    time = moment(todo.due_date).hour() + ':' + moment(todo.due_date).minute();
    if (moment(todo.due_date).minute() === 0) {
      time = time + '0';
    }
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <Text
        style={{
          color: COLORS.mainDark,
          borderRadius: 3,
          fontSize: 16,
          paddingRight: 1,
          paddingLeft: 1,
          fontFamily: 'Helvetica',
        }}
        onPress={datePickerHandler}>
        {date}
      </Text>
      {time && (
        <Text
          style={{
            color: COLORS.mainDark,
            borderRadius: 3,
            fontSize: 16,
            paddingRight: 1,
            paddingLeft: 1,
            fontFamily: 'Helvetica-Bold',
          }}
          onPress={timePickerHandler}>
          {time}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    height: 50,
    width: '98%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 5,
    paddingTop: 5,
  },
  radioButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  todoInfoContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  row1: {flex: 10, justifyContent: 'flex-end'},
  row2: {flex: 2, justifyContent: 'center'},
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
    color: 'black',
    fontFamily: 'Helvetica',
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

  expandedTools: {
    height: 30,
    paddingLeft: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mainLight,
  },
  todoTitle: {
    marginLeft: 5,
    flex: 1,
    marginRight: 25,
    padding: 0,
    fontSize: 30,
    textAlignVertical: 'center',
    color: COLORS.mainLight,
    fontFamily: 'Helvetica',
  },
  repeatPicker: {
    width: 150,
    color: COLORS.mainDark,
  },
  button: {
    marginLeft: 5,
    alignSelf: 'center',
  },
  pomoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomoTools: {
    color: COLORS.mainDark,
    marginLeft: 1,
    maxWidth: 20,
    fontSize: 15,
    textAlign: 'center',
    padding: 0,
  },
  pomoSeparator: {
    color: COLORS.mainDark,
    marginLeft: 1,
    maxWidth: 5,
    textAlign: 'center',
    padding: 0,
  },
  subTaskContainer: {flexDirection: 'row', alignItems: 'center'},
  note: {
    backgroundColor: 'white',
    height: '80%',
    textAlignVertical: 'top',
  },
  todoLabelContainer: {
    flexDirection: 'row',
    position: 'absolute',
  },
  datetimeView: {
    flexDirection: 'row', 
  }
});

export default Todo;
