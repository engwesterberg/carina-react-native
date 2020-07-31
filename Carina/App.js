import {COLORS} from './colors.js';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import Todo from './components/Todo';
import moment from 'moment';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [todos, setTodos] = useState([
    {
      id: 1,
      user_id: 11,
      title: 'Lets doit fellas',
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

  const loginUpdater = (aName, aEmail, aId) => {
    setLoggedIn(true);
    setName(aName);
    setUserId(aId);
  };

  return (
    <View style={styles.container}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && <Header title={name + "'s Carina"} />}
      {loggedIn && <CarinaBar user_id={userId} />}
      <Todo todo={todos[0]} />
      <Todo todo={todos[1]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkPurple,
  },
});

export default App;
