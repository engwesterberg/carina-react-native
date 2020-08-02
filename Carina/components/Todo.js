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
import {updateTodo, deleteTodo} from '../functions';
import Swipeable from 'react-native-swipeable-row';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Todo = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  //For updating todos
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newPomoEstimate, setNewPomoEstimate] = useState(
    props.todo.pomo_estimate,
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    console.warn('A date has been picked: ', date);
    setSelectedDate(moment(date));
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    console.warn('A time has been picked: ', moment(time));
    setSelectedTime(time);
    hideTimePicker();
  };

  const onModalClose = () => {
    let updated = props.todo;
    updated.title = newTitle ? newTitle : updated.title;
    updated.note = newNote ? newNote : updated.note;
    updated.pomo_estimate = newPomoEstimate
      ? newPomoEstimate
      : updated.pomo_estimate;

    updated.due_date = selectedDate ? selectedDate : updated.due_date;
    updateTodo(updated);
    props.todoListUpdater();
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
              defaultValue={props.todo.title}
              onChange={(event) => {
                if (event.nativeEvent.text) {
                  setNewTitle(event.nativeEvent.text);
                } else {
                  setNewTitle(props.todo.title);
                }
              }}
            />
            <View style={styles.expandedTools}>
              <View style={styles.pomoContainer}>
                <Button
                  icon={<Icon name="play" size={10} color="white" />}
                  buttonStyle={{
                    backgroundColor: COLORS.lightPurple,
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
                  onChange={(event) => {
                    setNewPomoEstimate(Number(event.nativeEvent.text));
                  }}
                />
              </View>
              <Button
                onPress={showDatePicker}
                icon={
                  <Icon name="calendar" size={15} color={COLORS.lightPurple} />
                }
                buttonStyle={styles.button}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onChange={(event) => {
                  setDatePickerVisibility(false);
                  console.warn("Date changed");
                }}
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
              <Button
                onPress={showTimePicker}
                buttonStyle={styles.button}
                icon={
                  <Icon name="clock-o" size={15} color={COLORS.lightPurple} />
                }
              />
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
              />
            </View>
          </View>
          <TextInput
            style={styles.note}
            placeholder="Write a note"
            defaultValue={props.todo.note}
            placeholderTextColor="gray"
            multiline={true}
            onChange={(event) => {
              setNewNote(event.nativeEvent.text);
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
              color={COLORS.darkPurple}
              onPress={() => {
                let updatedTodo = props.todo;
                updatedTodo.state = updatedTodo.state === 0 ? 1 : 0;
                console.log('Radio clicked');
                updateTodo(updatedTodo).then(props.todoListUpdater());
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
                  dateLabel(props.todo.due_date)}
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

const dateLabel = (date) => {
  const one_day = 1000 * 60 * 60 * 24;
  let color;
  let days;
  if (moment(date).date() === moment().date()) {
    color = COLORS.orange;
    days = 'Today';
  } else if (moment(date).date() == moment().date() + 1) {
    color = COLORS.yellow;
    days = 'Tomorrow';
  } else if (moment(date) >= moment() + 2) {
    color = COLORS.green;
    days = `Due in ${Math.floor((moment(date) - moment()) / one_day)} days`;
  } else if (moment(date) < moment()) {
    color = COLORS.red;
    days = `${Math.floor((moment() - moment(date)) / one_day)} days overdue`;
  }
  return (
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
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    height: 55,
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
    color: 'black',
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
    borderBottomColor: COLORS.lightPurple,
  },
  todoTitle: {
    marginLeft: 5,
    marginRight: 25,
    fontSize: 30,
    textAlignVertical: 'center',
    color: COLORS.lightPurple,
  },
  button: {
    backgroundColor: 'white',
  },
  pomoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomoTools: {
    color: COLORS.lightPurple,
    marginLeft: 1,
    maxWidth: 20,
    textAlign: 'center',
    padding: 0,
  },
  pomoSeparator: {
    color: COLORS.lightPurple,
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
});

export default Todo;
