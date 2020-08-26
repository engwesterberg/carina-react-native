import {COLORS} from './colors.js';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import PomodoroBar from './components/PomodoroBar';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuProvider } from 'react-native-popup-menu';


import {getTodos, getLists, emptyTrash} from './functions';

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
  const [pomoBreak, setPomoBreak] = useState(false);
  useEffect(() => {
    setDevelopmentUserState();
  }, []);

  const pomoBreakUpdater = () => {
    setPomoBreak(!pomoBreak);
  };

  const signOut = () => {
    setLoggedIn(false);
    setName(null);
    setEmail(null);
    setUserId(null);
    setTodos([]);
    setLists([]);
    setSelectedList({id: null, title: 'Carina'});
    setShowDone(false);
    setPomoActive(false);
  };

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
      todoListUpdater();
    });
  };

  const removeFromList = (todo_id) => {
    setTodos(todos.filter((item) => item.id !== todo_id));
  };

  const updatePomoActive = (todo) => {
    setPomoActive(todo);
  };

  return (
    <MenuProvider>
    <SafeAreaView style={styles.safeArea}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && (
        <View style={styles.container}>
          <Header
            selectedList={selectedList}
            lists={lists}
            userId={userId}
            listUpdater={listUpdater}
            selectedListUpdater={(list) => {
              setSelectedList(list);
            }}
            signOutHandler={signOut}
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
                <View
                  onStartShouldSetResponder={() => {
                    setShowDone(!showDone);
                  }}>
                  <Text style={styles.showDoneText}>
                    <MaterialCommunityIconsI size={15} name="check" />
                    {showDone ? 'Hide Done' : 'Show Done'}
                  </Text>
                </View>
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
              {selectedList.id === DELETED_LIST_ID && (
                <TodoList
                  todos={todos.filter((obj) => obj.state === DELETED)}
                  state={DELETED}
                  todoListUpdater={todoListUpdater}
                  removeFromList={removeFromList}
                  listId={selectedList ? selectedList.id : null}
                  listSpecificButton={
                    <View style={styles.listSpecificButton}>
                      <Icon
                        name="trash"
                        size={50}
                        color={COLORS.mainLight}
                        onPress={() => {
                          emptyTrash(userId).then(() => {
                            todoListUpdater();
                          });
                        }}
                      />
                      <Text style={styles.specificButtonText}>Empty Trash</Text>
                    </View>
                  }
                />
              )}
            </ScrollView>
          </View>
        </View>
      )}
      {/*pomoActive && (
        <PomodoroBar
          todo={pomoActive}
          updatePomoActive={updatePomoActive}
          userId={userId}
          countdownTime={pomoBreak ? 10 : 3}
          pomoBreakUpdater={pomoBreakUpdater}
        />
      )*/}
    </SafeAreaView></MenuProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
  },
  container: {flexGrow: 1, backgroundColor: 'white'},
  showDoneText: {
    color: COLORS.mainLight,
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Roboto',
    marginTop: 10,
    padding: 10,
  },
  listSpecificButton: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  specificButtonText: {
    color: COLORS.mainLight,
  },
});

export default App;
