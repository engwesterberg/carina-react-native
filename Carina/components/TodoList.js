/* eslint react-native/no-inline-styles: 0 */
import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Todo from './Todo';
import moment from 'moment';

const TodoList = (props) => {
  return (
    <View style={styles.todoListContainer}>
      {props.todos.map((item, index) => {
        return (
          <View>
            {item.due_date &&
              props.state === 0 &&
              daySeparator(
                item.due_date,
                index !== 0 && props.todos[index - 1].due_date,
              )}
            {index !== 0 &&
              props.state === 0 &&
              !item.due_date &&
              props.todos[index - 1].due_date &&
              daySeparator('No Date')}
            <Todo
              todo={item}
              todoListUpdater={props.todoListUpdater}
              removeFromList={props.removeFromList}
              updatePomoActive={props.updatePomoActive || null}
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
  let separatorText = (
    <View style={styles.daySeparatorContainer}>
      <Text
        style={[
          {
            color: current.date() < moment().date() ? COLORS.red : 'white',
          },
          styles.daySeparatorText,
        ]}>
        {current.format('MMMM Do ')}
      </Text>
    </View>
  );
  if (current.date() === previous.date()) {
    return null;
  }
  if (curr === 'No Date') {
    return (
      <View style={styles.daySeparatorContainer}>
        <Text
          style={[
            {
              color: 'white',
            },
            styles.daySeparatorText,
          ]}>
          No Date
        </Text>
      </View>
    );
  } else if (!prev) {
    separatorText = (
      <View style={styles.daySeparatorContainer}>
        <Text
          style={[
            {
              color: current.date() < moment().date() ? COLORS.red : 'white',
            },
            styles.daySeparatorText,
          ]}>
          {current.format('MMMM Do ')}
        </Text>
      </View>
    );
  }
  return separatorText;
};

const styles = StyleSheet.create({
  todoListContainer: {},
  firstSeparatorText: {color: 'white', fontSize: 18, marginLeft: 10},
  daySeparatorContainer: {
    backgroundColor: COLORS.mainLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderWidth: 0.2,
    borderColor: COLORS.mainDark,
  },
  daySeparatorText: {
    fontSize: 12,
    padding: 1,
  },
});

export default TodoList;
