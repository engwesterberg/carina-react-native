import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import AppButton from './AppButton.js';

const CarinaBar = (props) => {
  const [planningMode, setPlanningMode] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.bar}
        placeholder="Add task to Carina"
        placeholderTextColor={COLORS.lightPurple}
      />
      {!planningMode && (
        <Text
          style={styles.text}
          onPress={() => {
            setPlanningMode(true);
          }}>
          Planning Mode
        </Text>
      )}
      {planningMode && (
        <View>
          <TextInput
            style={styles.planningModeBar}
            placeholder="Enter todo attributes"
            placeholderTextColor={COLORS.lightPurple}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkPurple,
  },
  bar: {
    marginTop: 10,
    alignSelf: 'center',
    width: '95%',
    borderRadius: 5,
    fontSize: 30,
    backgroundColor: 'white',
  },
  planningModeBar: {
    marginTop: 10,
    alignSelf: 'center',
    width: '95%',
    borderRadius: 5,
    fontSize: 16,
    height: 40,
    textAlignVertical: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    marginTop: 5,
    marginLeft: 20,
  },
});

export default CarinaBar;
