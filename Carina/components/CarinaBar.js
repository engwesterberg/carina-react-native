import {COLORS} from '../colors.js';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
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
  const [planningModeButton, setPlanningModeButton] = useState(false);
  const [query, setQuery] = useState('');
  const [planningAttributes, setPlanningAttributes] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        style={styles.bar}
        placeholder="Add task to Carina"
        autoFocus={true}
        onFocus={() => {
          if (!planningMode) {
            setPlanningModeButton(true);
          }
        }}
        onBlur={() => {
          if (planningModeButton) {
            setPlanningMode(false);
          }
          setPlanningModeButton(false);
        }}
        placeholderTextColor={COLORS.mainLight}
        onSubmitEditing={(text) => {
          addTodo(
            props.userId,
            planningMode ? query + ' ' + planningAttributes : query,
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
      {planningModeButton && (
        <View style={styles.planningModContainer}>
          <Icon name="calendar-outline" size={15} color={COLORS.mainDark} />
          <Text
            style={styles.planningModeText}
            onPress={() => {
              setPlanningMode(true);
              setPlanningModeButton(false);
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
              setPlanningModeButton(true);
            }}
            onRightActionRelease={() => {
              setPlanningMode(false);
              setPlanningModeButton(true);
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
    backgroundColor: 'white',
  },
  bar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    backgroundColor: COLORS.mainSuperLight,
    width: '100%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    fontSize: 30,
    borderColor: COLORS.mainLight,
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
  planningModeBar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    backgroundColor: COLORS.mainSuperLight,
    width: '100%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    fontSize: 16,
    borderColor: COLORS.mainLight,
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
