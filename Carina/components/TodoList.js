/* eslint react-native/no-inline-styles: 0 */
import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Todo from './Todo';
import moment from 'moment';

const hr = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: '90%',
        backgroundColor: 'gray',
        alignSelf: 'center',
        marginBottom: 1,
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

  if (current.date() === previous.date()) {
    return null;
  }
  let separatorText = (
    <View style={styles.daySeparatorContainer}>
      <Text
        style={[
          {
            color: current.date() < moment().date() ? COLORS.red : 'black',
          },
          styles.daySeparatorText,
        ]}>
        {curr !== 'No Date' ? current.format('MMMM Do ') : 'No Date'}
      </Text>
    </View>
  );
  return separatorText;
};

const styles = StyleSheet.create({
  todoListContainer: {},
  daySeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  daySeparatorText: {
    fontSize: 22,
    padding: 1,
    fontFamily: 'Roboto-Bold',
    marginLeft: 15,
    marginBottom: 3,
  },
});

export default TodoList;
