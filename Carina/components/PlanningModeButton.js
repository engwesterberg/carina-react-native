import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../colors.js';

const PlanningModeButton = ({onClick, title, attribute}) => (
  <TouchableOpacity
    onPress={() => {
      onClick(attribute);
    }}
    style={styles.planningModContainer}>
    <Text style={styles.planningModeText} onPress={() => {}}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  planningModContainer: {
    marginTop: 10,
    marginLeft: 15,
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 3,
  },
  planningModeText: {color: COLORS.mainDark, marginLeft: 3},
});

export default PlanningModeButton;
