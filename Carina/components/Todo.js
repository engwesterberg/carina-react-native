/* eslint react-native/no-inline-styles: 0 */
import moment from 'moment';
import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {updateTodo, deleteTodo} from '../functions';
import Swipeable from 'react-native-swipeable-row';

const Todo = (props) => {
  return (
    <Swipeable
      rightContent={
        <View style={styles.swipeRight}>
          <Image
            style={styles.noteImg}
            source={require('../assets/trash-white.png')}
          />
        </View>
      }
            onRightActionRelease={() => {
              console.log("delete the shit")
            }}
      leftContent={
        <View>
          <Text>Pull action</Text>
        </View>
      }>
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
  swipeText: {
    color: 'white',
    fontSize: 24,
  },
});

export default Todo;
