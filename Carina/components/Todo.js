/* eslint react-native/no-inline-styles: 0 */

import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RadioButton} from 'react-native-paper';

const Todo = (props) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.radioButtonContainer}>
        <RadioButton
          status={props.todo.state === 0 ? 'unchecked' : 'checked'}
          color={COLORS.darkPurple}
        />
      </View>
      <View style={styles.todoInfoContainer}>
        <Text
          style={[
            styles.text,
            {
              textDecorationLine:
                props.todo.state === 1 ? 'line-through' : 'none',
            },
          ]}>
          {' '}
          {props.todo.title}
        </Text>
      </View>
      <View style={styles.noteContainer}>
        <Image
          style={styles.noteImg}
          source={require('../assets/note-added.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    height: 60,
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
    fontSize: 20,
    color: 'black',
  },
});

export default Todo;
