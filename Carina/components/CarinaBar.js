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
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {addTodo} from '../functions.js';

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
        placeholderTextColor={COLORS.mainLight}
        onSubmitEditing={(text) => {
          addTodo(
            props.userId,
            planningMode ? query + planningAttributes : query,
            props.listId,
          ).then(() => {
            props.todoListUpdater();
          });
          setQuery('');
        }}
        onChangeText={(text) => {
          setQuery(text);
        }}
      />
      {!planningMode && (
        <View style={styles.planningModContainer}>
          <Icon name="calendar-outline" size={15} color={COLORS.mainDark} />
          <Text
            style={styles.planningModeText}
            onPress={() => {
              setPlanningMode(true);
            }}>
            Planning Mode
          </Text>
        </View>
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
              placeholderTextColor={COLORS.mainLight}
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
    backgroundColor: COLORS.mainDark,
    paddingTop: 20,
    paddingBottom: 20,
  },
  bar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    width: '95%',
    borderRadius: 10,
    fontSize: 30,
    borderColor: COLORS.mainLight,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  planningModContainer: {
    marginTop: 10,
    marginLeft: 15,
    borderRadius: 3,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  planningModeText: {color: COLORS.mainDark, marginLeft: 3},
  planningModeBar: {
    marginTop: 10,
    alignSelf: 'center',
    width: '95%',
    borderRadius: 5,
    fontSize: 16,
    height: 40,
    textAlignVertical: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
  },
  boxShadow: {
    shadowColor: COLORS.mainDark,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 13.97,

    elevation: 20,
  },
});

export default CarinaBar;
