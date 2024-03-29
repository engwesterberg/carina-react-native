import {COLORS} from './colors.js';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';
import TodoList from './components/TodoList';
import Banner from './components/Banner';
//import PomodoroBar from './components/PomodoroBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  AppState,
} from 'react-native';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MenuProvider} from 'react-native-popup-menu';
import {ConfirmDialog} from 'react-native-simple-dialogs';

import {
  getTodos,
  getLists,
  emptyTrash,
  storageHelper,
  checkInternetConnection,
} from './functions';

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
  const [refreshing, setRefreshing] = React.useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    //setDevelopmentUserState();
    fetchLocalStorageAndData();

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const errorHandler = (err) => {
    if (err.response) {
      if (err.response.status === 403) {
        signOut();
      }
    }
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    if (appState.current === 'background') {
      let jsonString = JSON.stringify({todos: todos, lists: lists});
      storageHelper.set('offlineData', jsonString);
    }
  };

  const fetchLocalStorageAndData = () => {
    checkInternetConnection();
    storageHelper.get('token').then((tok) => {
      if (tok) {
        setToken(tok);
        storageHelper.get('user_id').then((id) => {
          if (id) {
            setUserId(id);
            getTodos(showDone, tok)
              .then((res) => {
                setTodos(res);
                setOnline(true);
              })
              .catch(async (err) => {
                errorHandler(err);
              });
            getLists(tok)
              .then((res) => {
                setLists(res);
                setOnline(true);
              })
              .catch(async (err) => {
                errorHandler(err);
              });
          } else {
            signOut();
          }
        });
      }
    });
  };

  //const pomoBreakUpdater = () => {
    //setPomoBreak(!pomoBreak);
  //};

  //const setDevelopmentUserState = () => {
    //setUserId(1);
    //getTodos(1).then((res) => {
      //setTodos(res);
    //});
    //getLists(1).then((res) => {
      //setLists(res);
    //});
  //};

  const signOut = (userSignedOut) => {
    if (!userSignedOut) {
      Toast.show('Refresh token has expired, please sign in again');
    }
    setUserId(null);
    setTodos([]);
    setLists([]);
    setSelectedList({id: null, title: 'Carina'});
    setShowDone(false);
    setPomoActive(false);
    storageHelper.remove('token');
    storageHelper.remove('user_id');
    storageHelper.remove('offlineTodos');
    storageHelper.remove('offlineLists');
  };

  const signInHandler = (aId, aToken) => {
    setUserId(aId);
    setToken(aToken);
    storageHelper.set('token', aToken);
    storageHelper.set('user_id', String(aId));
    getTodos(showDone, aToken).then((res) => {
      setTodos(res);
    });
    getLists(aToken).then((res) => {
      setLists(res);
    });
  };

  const todoListUpdater = () => {
    getTodos(showDone, token)
      .then((res) => {
        setTodos(res);
      })
      .catch((err) => {
        errorHandler(err);
      });
  };
  const listUpdater = () => {
    getLists(token)
      .then((res) => {
        setLists(res);
        todoListUpdater();
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  const removeFromList = (todo_id) => {
    setTodos(todos.filter((item) => item.id !== todo_id));
  };

  const updatePomoActive = (todo) => {
    setPomoActive(todo);
  };

  const onRefresh = useCallback(() => {
    fetchLocalStorageAndData();
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
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
              signOut={signOut}
              online={online}
              errorHandler={errorHandler}
            />
            {selectedList.id !== DELETED_LIST_ID && online ? (
              <CarinaBar
                token={token}
                userId={userId}
                todoListUpdater={todoListUpdater}
                listId={selectedList ? selectedList.id : null}
                online={online}
                errorHandler={errorHandler}
              />
            ) : null}
            {!online ? (
              <Banner
                title="Carina is offline"
                subtitle="Offline support is not here yet, but it's coming soon"
                icon={
                  <MaterialCommunityIconsI
                    color={COLORS.red}
                    size={30}
                    name="wifi-off"
                  />
                }
              />
            ) : null}
            <View style={{flex: 1, marginBottom: pomoActive ? 60 : 0}}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    title="Fetching todos"
                  />
                }>
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
                  online={online}
                  errorHandler={errorHandler}
                />
                {selectedList.id !== DELETED_LIST_ID && (
                  <TouchableOpacity
                    style={styles.showDoneView}
                    onPress={() => {
                      getTodos(!showDone, token)
                        .then((res) => {
                          setTodos(res);
                        })
                        .catch((err) => {
                          errorHandler(err);
                        });
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
                    online={online}
                    errorHandler={errorHandler}
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
                    online={online}
                    errorHandler={errorHandler}
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
                  visible={showTrashDialog && online}
                  onTouchOutside={() => {
                    setShowTrashDialog(false);
                  }}
                  positiveButton={{
                    title: 'YES',
                    onPress: () => {
                      setShowTrashDialog(false);
                      emptyTrash(token)
                        .then(() => {
                          todoListUpdater();
                        })
                        .catch((err) => {
                          errorHandler(err);
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
