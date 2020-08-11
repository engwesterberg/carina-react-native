import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PomodoroBar = (props) => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: COLORS.mainLight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PomodoroBar;
