import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, } from 'react-native';
import Todo from './Todo';

const TodoList = (props) => {
  return (
    <View style={styles.todoListContainer}>
      {props.todos.map((item, index) => {
        return item.state === props.state ? (<Todo todo={item} todoListUpdater={props.todoListUpdater}/>) : null
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  todoListContainer: {},
});

export default TodoList;
