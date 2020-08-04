import {COLORS} from './colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import {getTodos, getLists} from './functions';

const NOT_DONE = 0;
const DONE = 1;
const DELETE = 2;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);

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
    getLists(aId).then((res) => {
      setLists(res);
      console.log('lists: ', res);
    });
  };

  const todoListUpdater = () => {
    getTodos(userId).then((res) => {
      setTodos(res);
    });
  };
  const listUpdater = () => {
    getLists(userId).then((res) => {
      setLists(res);
    });
  };

  const removeFromList = (todo_id) => {
    setTodos(todos.filter((item) => item.id !== todo_id));
  };

  return (
    <View style={styles.container}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && (
        <View>
          <Header title={name + "'s Carina"} lists={lists} userId={userId} listUpdater={listUpdater} />
          <CarinaBar user_id={userId} todoListUpdater={todoListUpdater} />
          <ScrollView style={styles.scrollViewContainer}>
            <TodoList
              todos={todos}
              state={NOT_DONE}
              todoListUpdater={todoListUpdater}
              removeFromList={removeFromList}
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
                removeFromList={removeFromList}
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
