import {COLORS} from './colors.js';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import PomodoroBar from './components/PomodoroBar';
import TextButton from './components/TextButton';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MenuProvider} from 'react-native-popup-menu';
import {ConfirmDialog} from 'react-native-simple-dialogs';

import {getTodos, getLists, emptyTrash} from './functions';

const NOT_DONE = 0;
const DONE = 1;
const DELETED = 2;
const DELETED_LIST_ID = -1;

const App = () => {
  const [userId, setUserId] = useState(1);
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState({id: null, title: 'Carina'});
  //gui state
  const [showDone, setShowDone] = useState(false);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoBreak, setPomoBreak] = useState(false);
  const [showTrashDialog, setShowTrashDialog] = useState(false);

  useEffect(() => {
    setDevelopmentUserState();
  }, []);

  const pomoBreakUpdater = () => {
    setPomoBreak(!pomoBreak);
  };

  const setDevelopmentUserState = () => {
    setUserId(1);
    getTodos(1).then((res) => {
      setTodos(res);
    });
    getLists(1).then((res) => {
      setLists(res);
    });
  };

  const signOut = () => {
    setUserId(null);
    setTodos([]);
    setLists([]);
    setSelectedList({id: null, title: 'Carina'});
    setShowDone(false);
    setPomoActive(false);
  };

  const signInHandler = (aId) => {
    console.warn('Fetching todos for id: ', aId);
    setUserId(aId);
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
        {!userId && <LoginScreen signInHandler={signInHandler} />}
        {userId && (
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
                  lists={lists}
                />
                {selectedList.id !== DELETED_LIST_ID && (
                  <TouchableOpacity
                    style={styles.showDoneView}
                    onPress={() => {
                      setShowDone(!showDone);
                    }}>
                    <Text style={styles.showDoneText}>
                      <MaterialCommunityIconsI size={15} name="check" />
                      {showDone ? 'Hide Done' : 'Show Done'}
                    </Text>
                  </TouchableOpacity>
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
                    lists={lists}
                  />
                )}
                {selectedList.id === DELETED_LIST_ID && (
                  <TodoList
                    todos={todos.filter((obj) => obj.state === DELETED)}
                    state={DELETED}
                    todoListUpdater={todoListUpdater}
                    removeFromList={removeFromList}
                    listId={selectedList ? selectedList.id : null}
                    lists={lists}
                    childAtTop={true}>
                    <View style={styles.listSpecificButton}>
                      <Icon
                        name="trash"
                        size={50}
                        color={COLORS.mainLight}
                        onPress={() => {
                          setShowTrashDialog(true);
                        }}
                      />
                      <Text style={styles.specificButtonText}>Empty Trash</Text>
                    </View>
                  </TodoList>
                )}
                <ConfirmDialog
                  title="Empty Trash"
                  message={
                    'Are you sure you want to empty the trash? Changes will be permanent.'
                  }
                  visible={showTrashDialog}
                  onTouchOutside={() => {
                    setShowTrashDialog(false);
                  }}
                  positiveButton={{
                    title: 'YES',
                    onPress: () => {
                      setShowTrashDialog(false);
                      emptyTrash(userId).then(() => {
                        todoListUpdater();
                      });
                    },
                  }}
                  negativeButton={{
                    title: 'NO',
                    onPress: () => {
                      setShowTrashDialog(false);
                    },
                  }}
                />
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
      </SafeAreaView>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
  },
  container: {flexGrow: 1, backgroundColor: 'white'},
  showDoneView: {
    alignItems: 'center',
    marginTop: 15,
  },
  showDoneText: {
    color: COLORS.mainLight,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  listSpecificButton: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  specificButtonText: {
    color: COLORS.mainLight,
    marginBottom: 30,
  },
});

export default App;
