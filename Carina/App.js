import {COLORS} from './colors.js';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import PomodoroBar from './components/PomodoroBar';

import {getTodos, getLists} from './functions';

const NOT_DONE = 0;
const DONE = 1;
const DELETED = 2;
const DELETED_LIST_ID = -1;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(1);
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState({id: null, title: 'Carina'});
  //gui state
  const [showDone, setShowDone] = useState(false);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    setDevelopmentUserState();
  }, []);

  const setDevelopmentUserState = () => {
    setUserId(1);
    getTodos(1).then((res) => {
      setTodos(res);
    });
    getLists(1).then((res) => {
      setLists(res);
    });
    setLoggedIn(true);
  };

  const loginUpdater = (aName, aEmail, aId) => {
    setLoggedIn(true);
    setName(aName);
    setUserId(aId);
    setEmail(aEmail);
    getTodos(aId).then((res) => {
      setTodos(res);
    });
    getLists(aId).then((res) => {
      setLists(res);
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

  const updatePomoActive = (todo) => {
    setPomoActive(todo);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && (
        <View style={styles.container}>
          <Header
            title={selectedList.title}
            listId={selectedList.id}
            lists={lists}
            userId={userId}
            listUpdater={listUpdater}
            selectedListUpdater={(list) => {
              setSelectedList(list);
            }}
          />
          {selectedList.id !== DELETED_LIST_ID && (
            <CarinaBar
              userId={userId}
              todoListUpdater={todoListUpdater}
              listId={selectedList ? selectedList.id : null}
            />
          )}
          <View style={{flex: 1, marginBottom: pomoActive ? 60 : 0}}>
            <ScrollView>
              <TodoList
                todos={todos.filter(
                  (obj) =>
                    obj.state === NOT_DONE && obj.list_id === selectedList.id,
                )}
                state={NOT_DONE}
                todoListUpdater={todoListUpdater}
                removeFromList={removeFromList}
                listId={selectedList ? selectedList.id : null}
                updatePomoActive={updatePomoActive}
              />
              {selectedList.id !== DELETED_LIST_ID && (
                <Text
                  style={styles.showDoneText}
                  onPress={() => {
                    setShowDone(!showDone);
                  }}>
                  {showDone ? 'Hide Done' : 'Show Done'}
                </Text>
              )}
              {showDone && (
                <TodoList
                  todos={todos.filter(
                    (obj) =>
                      obj.state === DONE && obj.list_id === selectedList.id,
                  )}
                  state={DONE}
                  todoListUpdater={todoListUpdater}
                  removeFromList={removeFromList}
                  listId={selectedList ? selectedList.id : null}
                />
              )}
              {selectedList.id == DELETED_LIST_ID && (
                <TodoList
                  todos={todos.filter((obj) => obj.state === DELETED)}
                  state={DELETED}
                  todoListUpdater={todoListUpdater}
                  removeFromList={removeFromList}
                  listId={selectedList ? selectedList.id : null}
                />
              )}
            </ScrollView>
          </View>
        </View>
      )}
      {pomoActive && (
        <PomodoroBar
          todo={pomoActive}
          updatePomoActive={updatePomoActive}
          userId={userId}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.mainDark,
    flexGrow: 1,
  },
  container: {flexGrow: 1, backgroundColor: COLORS.mainDark},
  scrollContainer: {backgroundColor: 'red'},
  showDoneText: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
  },
});

export default App;
