import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = (props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}> {props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: COLORS.lightPurple,
  },
  text: {
    fontSize: 23,
    color: '#fff',
  },
});

export default Header;