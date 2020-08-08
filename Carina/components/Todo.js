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
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {updateTodo, deleteTodo, copyTodo} from '../functions';
import Swipeable from 'react-native-swipeable-row';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [newDate, setNewDate] = useState();
  const [hasTime, setHasTime] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);

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
            <View style={styles.expandedTools}>
              <View style={styles.pomoContainer}>
                <Button
                  icon={<Icon name="play" size={10} color="white" />}
                  buttonStyle={{
                    backgroundColor: COLORS.mainLight,
                    height: 20,
                    marginLeft: 5,
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
              <Button
                onPress={() => {
                  setShowDatePicker(true);
                }}
                icon={
                  <Icon name="calendar" size={15} color={COLORS.mainLight} />
                }
                buttonStyle={styles.button}
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
                  }
                  setNewDate(deadline);
                  syncTodoToDatabase(deadline);
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
              <Button
                onPress={() => {
                  setShowTimePicker(true);
                }}
                buttonStyle={styles.button}
                icon={
                  <Icon name="clock-o" size={15} color={COLORS.mainLight} />
                }
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
                    syncTodoToDatabase(deadline, true);
                    setHasTime(true);
                  }
                }}
                onCancel={() => {
                  setShowTimePicker(false);
                }}
              />
            </View>
          </View>
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
          deleteTodo(props.todo.id);
          props.removeFromList(props.todo.id);
        }}
        onLeftActionRelease={() => {
          deleteTodo(props.todo.id);
          props.removeFromList(props.todo.id);
        }}>
        <View style={styles.todoContainer} key={props.id}>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              status={props.todo.state === 0 ? 'unchecked' : 'checked'}
              color={COLORS.mainDark}
              onPress={() => {
                let updatedTodo = props.todo;
                updatedTodo.state = updatedTodo.state === 0 ? 1 : 0;
                updateTodo(updatedTodo).then(props.todoListUpdater());
                if (props.todo.recurring) {
                  let copy = props.todo;
                  copy.due_date = moment(copy.due_date).add(props.todo.recurring, 'days');
                  copyTodo(props.todo).then(() => {
                    updateTodo(updatedTodo).then(props.todoListUpdater());
                  });
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={() => {
              setModalVisible(true);
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
              <Image
                style={styles.noteImg}
                source={require('../assets/note-added.png')}
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
  if (moment(todo.due_date).date() === moment().date()) {
    color = COLORS.orange;
    days = 'Today';
  } else if (moment(todo.due_date).date() == moment().date() + 1) {
    color = COLORS.yellow;
    days = 'Tomorrow';
  } else if (moment(todo.due_date) >= moment() + 2) {
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
          backgroundColor: color,
          color: color === COLORS.yellow ? 'black' : 'white',
          alignSelf: 'flex-start',
          borderRadius: 3,
          padding: 1,
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

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    height: 55,
    width: '98%',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 1,
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
  row1: {flex: 7, justifyContent: 'flex-end'},
  row2: {flex: 3, justifyContent: 'center'},
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
    color: COLORS.mainDark,
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
  modalHeader: {},
  expandedTools: {
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mainLight,
  },
  todoTitle: {
    marginLeft: 5,
    marginRight: 25,
    fontSize: 30,
    textAlignVertical: 'center',
    color: COLORS.mainLight,
  },
  button: {
    backgroundColor: 'white',
  },
  pomoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomoTools: {
    color: COLORS.mainLight,
    marginLeft: 1,
    maxWidth: 20,
    textAlign: 'center',
    padding: 0,
  },
  pomoSeparator: {
    color: COLORS.mainLight,
    marginLeft: 1,
    maxWidth: 5,
    textAlign: 'center',
    padding: 0,
  },
  note: {
    backgroundColor: 'white',
    height: '80%',
    textAlignVertical: 'top',
  },
  todoLabelContainer: {
    flexDirection: 'row',
  },
});

export default Todo;
