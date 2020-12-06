import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../colors.js';

const Banner = (props) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      {props.icon}
    </View>
    <View style={styles.row}>
      <Text>{props.subtitle}</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    marginTop: 20,
    backgroundColor: COLORS.mainSuperLight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 28,
    color: COLORS.red,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: COLORS.red,
  },
});

export default Banner;
