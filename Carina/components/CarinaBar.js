import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

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
    fontSize: 20,
    height: 40,
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    marginTop: 5,
    marginLeft: 20,
  },
});

export default CarinaBar;
