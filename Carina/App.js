import {COLORS} from './colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import {getTodos} from './functions';

const NOT_DONE = 0;
const DONE = 1;
const DELETE = 2;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [todos, setTodos] = useState([
    {
      id: 1,
      user_id: 11,
      title: 'Lets doit bros',
      note: 'Very fast',
      list_id: null,
      due_date: null,
      hasTime: false,
      pomo_estimate: 2,
      pomo_done: 0,
      priority: null,
      state: 0,
      recurring: 1,
    },
    {
      id: 2,
      user_id: 11,
      title: 'Buy books',
      list_id: null,
      due_date: null,
      hasTime: false,
      pomo_estimate: 2,
      pomo_done: 0,
      priority: null,
      state: 1,
      recurring: 1,
    },
  ]);

  //gui state
  const [showDone, setShowDone] = useState(false);

  const loginUpdater = (aName, aEmail, aId) => {
    setLoggedIn(true);
    setName(aName);
    setUserId(aId);
    setEmail(aEmail);
    getTodos(aId).then((res) => {
      setTodos(res);
      console.log(res);
    });
  };

  const todoListUpdater = () => {
    getTodos(userId).then((res) => {
      setTodos(res);
    });
  };

  return (
    <View style={styles.container}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && (
        <View>
          <Header title={name + "'s Carina"} />
          <CarinaBar user_id={userId} todoListUpdater={todoListUpdater} />
          <ScrollView style={styles.scrollViewContainer}>
            <TodoList
              todos={todos}
              state={NOT_DONE}
              todoListUpdater={todoListUpdater}
            />
            <Text
              style={styles.showDoneText}
              onPress={() => {
                setShowDone(!showDone);
              }}>
              {showDone ? 'Hide Done' : 'Show Done'}
            </Text>
            {showDone && (
              <TodoList
                todos={todos}
                state={DONE}
                todoListUpdater={todoListUpdater}
              />
            )}
          </ScrollView>
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
  scrollViewContainer: {marginBottom: 185},
  showDoneText: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
  },
});

export default App;
