import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';

const AppButton = ({onPress, title}) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: 'white',
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: 'black',
    alignSelf: 'center',
  },
});

export default AppButton;
