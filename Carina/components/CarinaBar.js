import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import {newTodo} from '../functions.js';

const leftContent = <Text />;

const rightButtons = [
  <TouchableHighlight>
    <Text />
  </TouchableHighlight>,
];

const CarinaBar = (props) => {
  const [planningMode, setPlanningMode] = useState(false);
  const [query, setQuery] = useState('');
  const [planningAttributes, setPlanningAttributes] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        style={styles.bar}
        placeholder="Add task to Carina"
        placeholderTextColor={COLORS.lightPurple}
        onSubmitEditing={(text) => {
          newTodo(
            props.user_id,
            planningMode ? query + planningAttributes : query,
            null,
          );
          setQuery("");
        }}
        onChangeText={(text) => {
          setQuery(text);
        }}
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
          <Swipeable
            leftContent={leftContent}
            rightButtons={rightButtons}
            onLeftActionRelease={() => {
              setPlanningMode(false);
            }}
            onRightActionRelease={() => {
              setPlanningMode(false);
            }}>
            <TextInput
              style={styles.planningModeBar}
              placeholder="Enter todo attributes"
              placeholderTextColor={COLORS.lightPurple}
              onChangeText={(text) => {
                setPlanningAttributes(text);
              }}
            />
          </Swipeable>
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
