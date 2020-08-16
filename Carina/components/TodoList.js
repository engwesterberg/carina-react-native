/* eslint react-native/no-inline-styles: 0 */
import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Todo from './Todo';
import moment from 'moment';
import Hr from 'react-native-hr-component';

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
              showBorder={index !== props.todos.length}
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
            color:
              current.date() < moment().date() ? COLORS.red : COLORS.mainDark,
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
              color: COLORS.mainDark,
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
              color:
                current.date() < moment().date() ? COLORS.red : COLORS.mainDark,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  daySeparatorText: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    padding: 1,
    marginLeft: 15,
  },
});

export default TodoList;
