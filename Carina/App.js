import {COLORS} from './colors.js';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import PomodoroBar from './components/PomodoroBar';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MenuProvider} from 'react-native-popup-menu';
import {ConfirmDialog} from 'react-native-simple-dialogs';

import {getTodos, getLists, emptyTrash, storageHelper} from './functions';

const NOT_DONE = 0;
const DONE = 1;
const DELETED = 2;
const DELETED_LIST_ID = -1;

const App = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState({id: null, title: 'Carina'});
  //gui state
  const [showDone, setShowDone] = useState(false);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoBreak, setPomoBreak] = useState(false);
  const [showTrashDialog, setShowTrashDialog] = useState(false);

  useEffect(() => {
    //setDevelopmentUserState();
    storageHelper.get('token').then((tok) => {
      if (tok) {
        setToken(tok);
        storageHelper.get('user_id').then((id) => {
          if (id) {
            setUserId(id);
            getTodos(id, tok).then((res) => {
              setTodos(res);
            });
            getLists(id, tok).then((res) => {
              setLists(res);
            });
          }
        });
      }
    });
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
    storageHelper.remove('token');
    storageHelper.remove('user_id');
  };

  const signInHandler = (aId, aToken) => {
    setUserId(aId);
    setToken(aToken);
    storageHelper.set('token', aToken);
    storageHelper.set('user_id', String(aId));
    getTodos(aId, aToken).then((res) => {
      setTodos(res);
    });
    getLists(aId, aToken).then((res) => {
      setLists(res);
    });
  };

  const todoListUpdater = () => {
    getTodos(userId, token).then((res) => {
      setTodos(res);
    });
  };
  const listUpdater = () => {
    getLists(userId, token).then((res) => {
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
            <StatusBar backgroundColor={COLORS.mainDark} />
            <Header
              selectedList={selectedList}
              lists={lists}
              token={token}
              userId={userId}
              listUpdater={listUpdater}
              selectedListUpdater={(list) => {
                setSelectedList(list);
              }}
              signOutHandler={signOut}
            />
            {selectedList.id !== DELETED_LIST_ID && (
              <CarinaBar
                token={token}
                userId={userId}
                todoListUpdater={todoListUpdater}
                listId={selectedList ? selectedList.id : null}
              />
            )}
            <View style={{flex: 1, marginBottom: pomoActive ? 60 : 0}}>
              <ScrollView>
                <TodoList
                  token={token}
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
                    token={token}
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
                    token={token}
                    todos={todos.filter((obj) => obj.state === DELETED)}
                    state={DELETED}
                    removeFromList={removeFromList}
                    listId={selectedList ? selectedList.id : null}
                    lists={lists}
                    todoListUpdater={todoListUpdater}
                    childAtTop={true}>
                    {todos.filter((obj) => obj.state === DELETED).length > 0 ? (
                      <View style={styles.listSpecificButton}>
                        <Icon
                          name="trash"
                          size={50}
                          color={COLORS.mainLight}
                          onPress={() => {
                            setShowTrashDialog(true);
                          }}
                        />
                        <Text style={styles.specificButtonText}>
                          Empty trash
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.listSpecificButton}>
                        <MaterialCommunityIconsI
                          name="check-bold"
                          size={50}
                          color={COLORS.mainLight}
                        />
                        <Text style={styles.specificButtonText}>
                          The trash is empty :)
                        </Text>
                      </View>
                    )}
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
                      emptyTrash(userId, token).then(() => {
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
              token={token}
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
    padding: 15,
  },
  showDoneText: {
    color: COLORS.mainLight,
    fontSize: 18,
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
