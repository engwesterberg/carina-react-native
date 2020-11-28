import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../colors.js';

const AppButton = ({onPress, title, bgColor, textColor, wide}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      wide ? styles.appButtonWide : styles.appButton,
      {backgroundColor: bgColor || COLORS.mainSuperLight},
    ]}>
    <Text style={[styles.appButtonText, {color: textColor || 'black'}]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // ...
  appButton: {
    elevation: 8,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonWide: {
    elevation: 8,
    borderRadius: 3,
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 70,
  },
  appButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    alignSelf: 'center',
  },
});

export default AppButton;
