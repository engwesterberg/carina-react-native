/* eslint react-native/no-inline-styles: 0 */
import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Todo from './Todo';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const hr = (color) => {
  return (
    <View
      style={{
        flex: 1,
        height: 1,
        marginRight: 13,
        marginLeft: 10,
        backgroundColor: color,
        alignSelf: 'center',
        marginTop: 5,
      }}>
      <Text />
    </View>
  );
};
const TodoList = (props) => {
  return (
    <View style={styles.todoListContainer}>
      {props.todos.map((item, index) => {
        return (
          <View>
            {item.due_date &&
              props.state !== 2 &&
              daySeparator(
                item.due_date,
                index !== 0 && props.todos[index - 1].due_date,
              )}
            {index !== 0 &&
              props.state !== 2 &&
              !item.due_date &&
              props.todos[index - 1].due_date &&
              daySeparator('No Date')}
            <Todo
              todo={item}
              todoListUpdater={props.todoListUpdater}
              removeFromList={props.removeFromList}
              updatePomoActive={props.updatePomoActive || null}
              showBorder={index !== props.todos.length}
              lists={props.lists}
            />
          </View>
        );
      })}
      {props.listSpecificButton}
    </View>
  );
};
const daySeparator = (curr, prev) => {
  let current = moment(curr);
  let previous = moment(prev);

  if (current.date() === previous.date()) {
    return null;
  }
  let isToday = current.endOf('day').diff(moment().endOf('day'), 'days') === 0;
  let wasYesterday =
    current
      .endOf('day')
      .diff(moment().subtract(1, 'day').endOf('day'), 'days') === 0;
  let isTomorrow =
    current.endOf('day').diff(moment().add(1, 'day').endOf('day'), 'days') ===
    0;
  let color;
  if (current.endOf('day') < moment().endOf('day')) {
    color = COLORS.red;
  } else if (isToday) {
    color = COLORS.orange;
  } else if (isTomorrow) {
    color = COLORS.yellow;
  } else {
    color = COLORS.gray;
  }

  let text;
  if (isToday) {
    text = 'Today';
  } else if (isTomorrow) {
    text = 'Tomorrow';
  } else if (curr === 'No Date') {
    text = 'No Date';
  } else if (wasYesterday) {
    text = 'Yesterday';
  } else {
    text = current.format('MMMM Do ');
  }
  let separatorText = (
    <View style={styles.daySeparatorContainer}>
      <Icon name="calendar" size={22} color={color} />
      <Text
        style={[
          {
            color: color,
          },
          styles.daySeparatorText,
        ]}>
        {text}
      </Text>
      {hr(color)}
    </View>
  );
  return separatorText;
};

const styles = StyleSheet.create({
  todoListContainer: {marginTop: 10},
  daySeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
  },
  daySeparatorText: {
    fontSize: 22,
    padding: 1,
    fontFamily: 'Roboto-Light',
    marginLeft: 3,
  },
});

export default TodoList;
