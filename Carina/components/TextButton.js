import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';

const TextButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.appButtonContainer}>
    {props.icon}
    <Text style={styles.appButtonText}>{props.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: 60,
  },
  appButtonText: {
    fontSize: 12,
    color: 'black',
  },
});

export default TextButton;
